
import { useState, useEffect } from "react";

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  committeeName: string;
  apiPassword: string;
}

interface UseSignUpFlowProps {
  onSubmit: (data: SignUpData) => Promise<void>;
}

export const useSignUpFlow = ({ onSubmit }: UseSignUpFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  const [apiPassword, setApiPassword] = useState("");

  // Generate random API password on component mount
  useEffect(() => {
    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
      let result = "";
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    setApiPassword(generatePassword());
  }, []);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validatePassword()) return;
      if (!email) {
        setPasswordError("Email is required");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!committeeName) {
        setPasswordError("Committee name is required");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3) {
      setIsLoading(true);
      try {
        await onSubmit({
          email,
          password,
          confirmPassword,
          committeeName,
          apiPassword
        });
      } catch (error) {
        console.error("Sign up error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };

  return {
    currentStep,
    isLoading,
    passwordError,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    committeeName,
    setCommitteeName,
    apiPassword,
    handleNext,
    handlePrevious,
    handleSubmit
  };
};
