
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthSidebar from "@/components/Auth/AuthSidebar";
import SignUpForm from "@/components/Auth/SignUpForm";
import { SignUpData } from "@/hooks/useSignUpFlow";

const SignUp = () => {
  const { signUp } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    await signUp(data.email, data.password);
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
