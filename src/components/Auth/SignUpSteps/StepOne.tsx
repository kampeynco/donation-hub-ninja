
import React from "react";
import { Input } from "@/components/ui/input";
import PasswordInput from "../PasswordInput";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface StepOneProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  committeeName: string;
  setCommitteeName: (committeeName: string) => void;
  error: string;
}

const StepOne: React.FC<StepOneProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  committeeName,
  setCommitteeName,
  error,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full"
        />
      </div>

      <FormItem className="space-y-2">
        <Label htmlFor="committeeName" className="block text-sm font-medium text-gray-700">
          Committee Name
        </Label>
        <Input
          id="committeeName"
          type="text"
          value={committeeName}
          onChange={(e) => setCommitteeName(e.target.value)}
          placeholder="Your Committee Name"
          required
          className="w-full"
        />
      </FormItem>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={!!error}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );
};

export default StepOne;
