
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthSidebar from "@/components/Auth/AuthSidebar";
import SignUpForm from "@/components/Auth/SignUpForm";
import { SignUpData } from "@/hooks/useSignUpFlow";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (data: SignUpData) => {
    try {
      // Step 1: Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");
      
      // Step 2: Update profile with committee name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ committee_name: data.committeeName })
        .eq('id', authData.user.id);
      
      if (profileError) throw profileError;
      
      // Step 3: Create webhook credentials
      const { error: webhookError } = await supabase
        .from('webhooks')
        .insert({
          user_id: authData.user.id,
          api_username: data.email,
          api_password: data.apiPassword
        });
      
      if (webhookError) throw webhookError;
      
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials. Your webhook details have been saved.",
        duration: 5000,
      });
      
      // Sign out the automatically signed in user (Supabase behavior)
      await supabase.auth.signOut();
      
      // Navigate to sign in page
      navigate("/auth/signin");
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
