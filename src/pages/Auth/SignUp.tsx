
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconEye, IconEyeOff, IconCopy } from "@tabler/icons-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [showApiPassword, setShowApiPassword] = useState(false);
  const [apiPassword, setApiPassword] = useState("");

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-medium`}>
              1
            </div>
            <span className={`font-medium ${currentStep === 1 ? 'text-gray-900' : 'text-gray-500'}`}>Account</span>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-medium`}>
              2
            </div>
            <span className={`font-medium ${currentStep === 2 ? 'text-gray-900' : 'text-gray-500'}`}>Committee</span>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-medium`}>
              3
            </div>
            <span className={`font-medium ${currentStep === 3 ? 'text-gray-900' : 'text-gray-500'}`}>API Access</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required 
                    className="w-full" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••••••" 
                      required 
                      className="w-full pr-10" 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="••••••••••••" 
                      required 
                      className={`w-full pr-10 ${passwordError ? "border-red-500" : ""}`} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <label htmlFor="committeeName" className="block text-sm font-medium text-gray-700">
                    Committee Name
                  </label>
                  <Input
                    id="committeeName"
                    type="text"
                    value={committeeName}
                    onChange={e => setCommitteeName(e.target.value)}
                    placeholder="Your Committee Name"
                    required
                    className="w-full"
                  />
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">API Access Credentials</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use these credentials to access the DonorCamp API. Save these details as they won't be shown again.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">
                        Endpoint URL
                      </label>
                      <div className="relative">
                        <Input 
                          id="endpoint" 
                          type="text" 
                          value="https://api.donorcamp.com/v1" 
                          readOnly
                          className="w-full pr-10" 
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                          onClick={() => copyToClipboard("https://api.donorcamp.com/v1")}
                        >
                          <IconCopy size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <div className="relative">
                        <Input 
                          id="username" 
                          type="text" 
                          value={email} 
                          readOnly
                          className="w-full pr-10" 
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                          onClick={() => copyToClipboard(email)}
                        >
                          <IconCopy size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="apiPassword" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <Input 
                          id="apiPassword" 
                          type={showApiPassword ? "text" : "password"} 
                          value={apiPassword} 
                          readOnly
                          className="w-full pr-16" 
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                          <button 
                            type="button" 
                            className="text-gray-500 mr-2" 
                            onClick={() => setShowApiPassword(!showApiPassword)}
                          >
                            {showApiPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                          </button>
                          <button 
                            type="button" 
                            className="text-gray-500" 
                            onClick={() => copyToClipboard(apiPassword)}
                          >
                            <IconCopy size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <Input
                    id="street"
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="123 Main St"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Your City"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <Input
                      id="state"
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="State"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <Input
                      id="zip"
                      type="text"
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      placeholder="12345"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </>
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
