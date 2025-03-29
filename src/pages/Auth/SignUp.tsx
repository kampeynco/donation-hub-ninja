
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthSidebar from "@/components/Auth/AuthSidebar";
import SignUpForm from "@/components/Auth/SignUpForm";
import { SignUpData } from "@/hooks/useSignUpFlow";
import { createHookdeckWebhook } from "@/services/webhookService";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = async (data: SignUpData) => {
    try {
      console.log("Processing signup:", {
        email: data.email,
        committeeName: data.committeeName,
      });
      
      // Create the user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            committee_name: data.committeeName
          }
        }
      });
      
      if (authError) {
        console.error("Auth error during signup:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("No user returned from auth signup");
        throw new Error("Failed to create user account");
      }
      
      console.log("User created successfully:", authData.user.id);
      
      // Update the profile with committee name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ committee_name: data.committeeName })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }
      
      console.log("Profile updated with committee name");
      
      // Create Hookdeck webhook
      try {
        const hookdeckUrl = await createHookdeckWebhook(authData.user.id, data.email);
        console.log("Hookdeck webhook created:", hookdeckUrl);
      } catch (hookdeckError) {
        console.error("Hookdeck webhook creation error:", hookdeckError);
        // Continue even if Hookdeck creation fails
      }
      
      // Create webhook credentials 
      const { error: webhookError } = await supabase
        .from('webhooks')
        .insert({
          user_id: authData.user.id,
          api_username: data.email,
          api_password: data.apiPassword,
          hookdeck_destination_url: "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook"
        });
      
      if (webhookError) {
        console.error("Webhook creation error:", webhookError);
        throw webhookError;
      }
      
      console.log("Webhook credentials created");
      
      toast({
        title: "Account created successfully",
        description: "Welcome to DonorCamp!",
        duration: 5000,
      });
      
      // Navigate to dashboard - user is already signed in by default
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error creating account",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error; // Rethrow to be handled in the form component
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Blue Background */}
      <AuthSidebar 
        title="Create an account"
        description="Join DonorCamp to track donor activity and build deeper relationships with donors."
        linkLabel="Already have an account?"
        linkUrl="/auth/signin"
        linkText="Sign in"
      />
      
      {/* Right Column - White Background with Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <SignUpForm onSubmit={handleSignUp} />
        
        <div className="mt-8 text-center md:hidden">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
