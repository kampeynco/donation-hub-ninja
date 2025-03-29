
import React from "react";
import { Button } from "@/components/ui/button";
import StepOne from "@/components/Auth/SignUpSteps/StepOne";
import { useSignUpFlow, SignUpData } from "@/hooks/useSignUpFlow";
import { IconArrowRight } from "@tabler/icons-react";

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const {
    isLoading,
    error,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    committeeName,
    setCommitteeName,
    handleSubmit
  } = useSignUpFlow({ onSubmit });

  return (
    <div className="w-full max-w-md">
      <div className="text-center md:text-left mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
        <p className="text-gray-600">
          Create your account to start tracking donors and managing your fundraising campaigns
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <StepOne 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          committeeName={committeeName}
          setCommitteeName={setCommitteeName}
          error={error}
        />
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading 
            ? "Creating account..." 
            : <>Create Account <IconArrowRight className="ml-1 h-4 w-4" /></>
          }
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
