
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  
  // Generate random API password on hook mount
  const [apiPassword] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors
    
    if (!validateEmail() || !validatePassword() || !validateCommitteeName()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit({
        email,
        password,
        confirmPassword,
        committeeName,
        apiPassword
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    handleSubmit
  };
};
