
import React from "react";
import { Label } from "@/components/ui/label";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { WebhookCredentials } from "@/services/webhookService";

interface WebhookCredentialsSectionProps {
  webhookCredentials: WebhookCredentials;
  onPasswordRegenerated: (newCredentials: WebhookCredentials) => void;
}

const WebhookCredentialsSection: React.FC<WebhookCredentialsSectionProps> = ({
  webhookCredentials,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Webhook Credentials</h3>
      <p className="text-sm text-gray-500 mb-4">
        Use these credentials in your ActBlue webhook settings to authenticate requests to DonorCamp.
      </p>
      
      <CopyableInput 
        id="apiUsername" 
        value={webhookCredentials.api_username} 
        label="Username" 
        copyMessage="Username copied to clipboard"
      />
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="apiPassword">Password</Label>
        <CopyablePasswordInput 
          id="apiPassword" 
          value={webhookCredentials.api_password} 
        />
        <p className="text-xs text-gray-500">
          For security reasons, keep this password confidential.
        </p>
      </div>
    </div>
  );
};

export default WebhookCredentialsSection;
