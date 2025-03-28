
import React from "react";
import { Input } from "@/components/ui/input";

interface StepTwoProps {
  committeeName: string;
  setCommitteeName: (committeeName: string) => void;
  passwordError: string;
}

const StepTwo: React.FC<StepTwoProps> = ({
  committeeName,
  setCommitteeName,
  passwordError,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="committeeName" className="block text-sm font-medium text-gray-700">
          Committee Name
        </label>
        <Input
          id="committeeName"
          type="text"
          value={committeeName}
          onChange={(e) => setCommitteeName(e.target.value)}
          placeholder="Your Committee Name"
          required
          className="w-full"
        />
      </div>
      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
    </>
  );
};

export default StepTwo;
