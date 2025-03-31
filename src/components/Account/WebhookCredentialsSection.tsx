
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { WebhookCredentials, regenerateApiPassword } from "@/services/webhookService";
import { toast } from "@/hooks/use-toast";

interface WebhookCredentialsSectionProps {
  webhookCredentials: WebhookCredentials;
  onPasswordRegenerated: (newCredentials: WebhookCredentials) => void;
}

const WebhookCredentialsSection: React.FC<WebhookCredentialsSectionProps> = ({
  webhookCredentials,
  onPasswordRegenerated
}) => {
  const [isRegeneratingPassword, setIsRegeneratingPassword] = useState(false);

  const handleRegeneratePassword = async () => {
    setIsRegeneratingPassword(true);
    try {
      const newPassword = await regenerateApiPassword(webhookCredentials.id);
      if (newPassword) {
        const updatedCredentials = {
          ...webhookCredentials,
          api_password: newPassword
        };
        onPasswordRegenerated(updatedCredentials);
        toast({
          title: "Password regenerated",
          description: "Your new webhook password has been generated. Make sure to update your ActBlue webhook settings."
        });
      } else {
        throw new Error("Failed to regenerate webhook password");
      }
    } catch (error) {
      console.error("Error regenerating webhook password:", error);
      toast({
        title: "Error regenerating password",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRegeneratingPassword(false);
    }
  };

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
        <div className="flex justify-between items-center">
          <Label htmlFor="apiPassword">Password</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRegeneratePassword} 
            disabled={isRegeneratingPassword} 
            className="h-8 px-2 text-xs"
          >
            <IconRefresh size={16} className="mr-1" />
            {isRegeneratingPassword ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
        <CopyablePasswordInput 
          id="apiPassword" 
          value={webhookCredentials.api_password} 
        />
        <p className="text-xs text-gray-500">
          For security reasons, we recommend regenerating your webhook password periodically.
        </p>
      </div>
    </div>
  );
};

export default WebhookCredentialsSection;
