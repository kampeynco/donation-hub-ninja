
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
      <p className="text-sm text-gray-600 mb-4">Use these credentials to integrate your ActBlue account. These details will be available in your account settings.</p>

      <div className="space-y-4">
        <CopyableInput id="endpoint" value="https://api.donorcamp.com/v1" label="Endpoint URL" />
        
        <CopyableInput id="username" value={email} label="Username" />
        
        <CopyablePasswordInput id="apiPassword" value={apiPassword} label="Password" />
      </div>
    </div>
  );
};

export default StepThree;
