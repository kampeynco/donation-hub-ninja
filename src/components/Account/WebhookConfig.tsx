
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { IconRefresh } from "@tabler/icons-react";
import { WebhookCredentials, regenerateApiPassword } from "@/services/webhookService";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface WebhookConfigProps {
  webhookCredentials: WebhookCredentials | null;
  setWebhookCredentials: React.Dispatch<React.SetStateAction<WebhookCredentials | null>>;
  actBlueWebhookUrl: string;
  setActBlueWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
}

const WebhookConfig = ({
  webhookCredentials,
  setWebhookCredentials,
  actBlueWebhookUrl,
  setActBlueWebhookUrl
}: WebhookConfigProps) => {
  const [isRegeneratingPassword, setIsRegeneratingPassword] = useState(false);

  const handleRegeneratePassword = async () => {
    if (!webhookCredentials) return;
    
    setIsRegeneratingPassword(true);
    try {
      const newPassword = await regenerateApiPassword(webhookCredentials.id);
      if (newPassword) {
        setWebhookCredentials({
          ...webhookCredentials,
          api_password: newPassword
        });
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

  return <div className="space-y-6">
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

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="font-medium">Webhook Credentials</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use these credentials in your ActBlue webhook settings to authenticate requests to DonorCamp.
        </p>
        
        {webhookCredentials ? <div className="space-y-4">
            <CopyableInput 
              id="apiUsername" 
              value={webhookCredentials.api_username} 
              label="Username" 
              copyMessage="Username copied to clipboard"
            />
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="apiPassword">Password</Label>
                <Button variant="ghost" size="sm" onClick={handleRegeneratePassword} disabled={isRegeneratingPassword} className="h-8 px-2 text-xs">
                  <IconRefresh size={16} className="mr-1" />
                  {isRegeneratingPassword ? "Regenerating..." : "Regenerate"}
                </Button>
              </div>
              <CopyablePasswordInput id="apiPassword" value={webhookCredentials.api_password} />
              <p className="text-xs text-gray-500">
                For security reasons, we recommend regenerating your webhook password periodically.
              </p>
            </div>
          </div> : <div className="py-4 text-center text-gray-500">
            Loading webhook credentials...
          </div>}
      </div>
    </div>;
};

export default WebhookConfig;
