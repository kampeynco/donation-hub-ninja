
import React from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/Auth/StepIndicator";
import StepOne from "@/components/Auth/SignUpSteps/StepOne";
import StepTwo from "@/components/Auth/SignUpSteps/StepThree";
import { useSignUpFlow, SignUpData } from "@/hooks/useSignUpFlow";
import { IconArrowRight } from "@tabler/icons-react";

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => Promise<void>;
}

const steps = [
  { number: 1, title: "Account" },
  { number: 2, title: "Webhook" }
];

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const {
    currentStep,
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
    apiPassword,
    handlePrevious,
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
      
      <StepIndicator currentStep={currentStep} steps={steps} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
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
        )}

        {currentStep === 2 && (
          <StepTwo 
            email={email}
            apiPassword={apiPassword}
          />
        )}
        
        {error && currentStep === 2 && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          
          <Button 
            type="submit" 
            className={`${currentStep === 1 && "w-full"}`} 
            disabled={isLoading}
          >
            {isLoading 
              ? currentStep < 2 ? "Processing..." : "Creating account..." 
              : currentStep === 2 
                ? "Complete Registration" 
                : <>Next <IconArrowRight className="ml-1 h-4 w-4" /></>
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
