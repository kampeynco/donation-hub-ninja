
import React from "react";
import { Label } from "@/components/ui/label";
import CopyableInput from "@/components/Auth/CopyableInput";

interface WebhookEndpointProps {
  actBlueWebhookUrl: string;
}

const WebhookEndpoint: React.FC<WebhookEndpointProps> = ({
  actBlueWebhookUrl
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="actBlueWebhookUrl">Endpoint URL</Label>
      <div className="space-y-2">
        <CopyableInput 
          id="actBlueWebhookUrl" 
          value={actBlueWebhookUrl} 
          readOnly={true}
          className="w-full"
          copyMessage="Endpoint URL copied to clipboard"
        />
      </div>
      <p className="text-xs text-gray-500">
        Add this webhook URL to your ActBlue account settings to receive donation notifications.
      </p>
    </div>
  );
};

export default WebhookEndpoint;
