
import React from "react";
import { Separator } from "@/components/ui/separator";
import { WebhookCredentials } from "@/services/webhookService";
import WebhookEndpoint from "./WebhookEndpoint";
import WebhookCredentialsSection from "./WebhookCredentialsSection";

interface WebhookConfigProps {
  webhookCredentials: WebhookCredentials | null;
  setWebhookCredentials: React.Dispatch<React.SetStateAction<WebhookCredentials | null>>;
  actBlueWebhookUrl: string;
  setActBlueWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
}

const WebhookConfig: React.FC<WebhookConfigProps> = ({
  webhookCredentials,
  setWebhookCredentials,
  actBlueWebhookUrl
}) => {
  const handlePasswordRegenerated = (updatedCredentials: WebhookCredentials) => {
    setWebhookCredentials(updatedCredentials);
  };

  return (
    <div className="space-y-6">
      <WebhookEndpoint actBlueWebhookUrl={actBlueWebhookUrl} />
      
      <Separator className="my-6" />
      
      {webhookCredentials ? (
        <WebhookCredentialsSection 
          webhookCredentials={webhookCredentials}
          onPasswordRegenerated={handlePasswordRegenerated}
        />
      ) : (
        <div className="py-4 text-center text-gray-500">
          Loading webhook credentials...
        </div>
      )}
    </div>
  );
};

export default WebhookConfig;
