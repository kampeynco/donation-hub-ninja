import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    signIn
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex min-h-screen">
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
          
          <h1 className="text-4xl font-bold mb-6">Welcome back</h1>
          <p className="text-lg mb-10">Sign in to access your dashboard to track donor activity and manage relationships.</p>
          
          <div className="mt-10">
            <p>
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-white underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - White Background with Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-600">
              Access your donor management dashboard and continue your fundraising efforts
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" required className="w-full pr-10" />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-8 text-center md:hidden">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-primary font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default SignIn;