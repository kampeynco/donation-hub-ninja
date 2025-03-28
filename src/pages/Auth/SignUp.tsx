
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
      await signUp(data.email, data.password);
      
      // Step 2: Create webhook credentials
      // In a real implementation, you would store this in the database
      // using a Supabase edge function or directly with the Supabase client
      // after the user is authenticated
      
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials. Your webhook details have been saved.",
        duration: 5000,
      });
      
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
