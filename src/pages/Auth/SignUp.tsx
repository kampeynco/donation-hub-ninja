
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/Auth/StepIndicator";
import StepOne from "@/components/Auth/SignUpSteps/StepOne";
import StepTwo from "@/components/Auth/SignUpSteps/StepTwo";
import StepThree from "@/components/Auth/SignUpSteps/StepThree";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Committee information (step 2)
  const [committeeName, setCommitteeName] = useState("");

  // Address information (step 3)
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  
  // API credentials (step 3)
  const [apiPassword, setApiPassword] = useState("");

  const steps = [
    { number: 1, title: "Account" },
    { number: 2, title: "Committee" },
    { number: 3, title: "API Access" }
  ];

  const {
    signUp
  } = useAuth();

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
        await signUp(email, password);
      } catch (error) {
        console.error("Sign up error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Blue Background */}
      <div className="hidden md:flex md:w-1/2 bg-primary flex-col items-center justify-center text-white p-10">
        <div className="max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#2563EB" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">DonorCamp</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">Create an account</h1>
          <p className="text-lg mb-10">Join DonorCamp to track donor activity and build deeper relationships with donors.</p>
          
          <div className="mt-10">
            <p>
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-white underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - White Background with Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
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
                passwordError={passwordError}
              />
            )}

            {currentStep === 2 && (
              <StepTwo 
                committeeName={committeeName}
                setCommitteeName={setCommitteeName}
                passwordError={passwordError}
              />
            )}

            {currentStep === 3 && (
              <StepThree 
                email={email}
                apiPassword={apiPassword}
                street={street}
                setStreet={setStreet}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                zip={zip}
                setZip={setZip}
              />
            )}
            
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
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
                  ? "Creating account..." 
                  : currentStep === 3 
                    ? "Create Account" 
                    : "Next"
                }
              </Button>
            </div>
          </form>
          
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
    </div>
  );
};

export default SignUp;
