
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  committeeName: string;
  apiPassword: string;
  currentStep: number;
}

interface UseSignUpFlowProps {
  onSubmit: (data: SignUpData) => Promise<void>;
}

export const useSignUpFlow = ({ onSubmit }: UseSignUpFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
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

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    
    return true;
  };

  const validateCommitteeName = () => {
    if (!committeeName || committeeName.trim() === "") {
      setError("Committee name is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateEmail() || !validatePassword()) {
        return;
      }
      
      setCurrentStep(2);
      setError(""); // Clear errors when moving to next step
    } else if (currentStep === 2) {
      if (!validateCommitteeName()) {
        return;
      }
      setCurrentStep(3);
      setError(""); // Clear errors when moving to next step
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(""); // Clear errors when moving to previous step
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For step 1, validate email and password
    if (currentStep === 1) {
      if (!validateEmail() || !validatePassword()) {
        return;
      }
      
      setIsLoading(true);
      try {
        await onSubmit({
          email,
          password,
          confirmPassword,
          committeeName,
          apiPassword,
          currentStep
        });
        
        handleNext();
      } catch (error: any) {
        console.error("Step 1 error:", error);
        setError(error.message || "An error occurred during step 1");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // For step 2, validate committee name
    if (currentStep === 2) {
      if (!validateCommitteeName()) {
        return;
      }
      
      setIsLoading(true);
      try {
        await onSubmit({
          email,
          password,
          confirmPassword,
          committeeName,
          apiPassword,
          currentStep
        });
        
        handleNext();
      } catch (error: any) {
        console.error("Step 2 error:", error);
        setError(error.message || "An error occurred during step 2");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // For step 3, complete the process
    if (currentStep === 3) {
      setIsLoading(true);
      try {
        await onSubmit({
          email,
          password,
          confirmPassword,
          committeeName,
          apiPassword,
          currentStep
        });
        
        // If we reach here, submission was successful
        console.log("Form submission successful");
      } catch (error: any) {
        console.error("Step 3 error:", error);
        setError(error.message || "An error occurred during step 3");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
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
    handleNext,
    handlePrevious,
    handleSubmit
  };
};
