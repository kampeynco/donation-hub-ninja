
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";

interface StepTwoProps {
  committeeName: string;
  setCommitteeName: (committeeName: string) => void;
  error: string;
}

const StepTwo: React.FC<StepTwoProps> = ({
  committeeName,
  setCommitteeName,
  error,
}) => {
  return (
    <>
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
          className={`w-full ${error ? "border-red-500" : ""}`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </FormItem>
    </>
  );
};

export default StepTwo;
