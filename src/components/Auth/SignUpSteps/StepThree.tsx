
import React from "react";
import CopyableInput from "../CopyableInput";
import CopyablePasswordInput from "../CopyablePasswordInput";

interface StepThreeProps {
  email: string;
  apiPassword: string;
}

const StepThree: React.FC<StepThreeProps> = ({
  email,
  apiPassword
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">ActBlue Webhook Credentials</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use these credentials to integrate your ActBlue account. Your webhook URL will be
        available in your account settings after signing up.
      </p>

      <div className="space-y-4">
        <CopyableInput id="username" value={email} label="Username" />
        
        <CopyablePasswordInput id="apiPassword" value={apiPassword} label="Password" />

        <div className="mt-3 text-xs text-gray-500">
          Your secure webhook URL will be generated and available in your account settings
          after completing the sign-up process.
        </div>
      </div>
    </div>
  );
};

export default StepThree;
