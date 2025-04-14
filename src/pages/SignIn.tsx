
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const { signIn } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input 
                type="password" 
                id="password" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-donor-blue text-white rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>Don't have an account? <Link to="/signup" className="text-donor-blue hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
