
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { IconRefresh, IconPlaylistAdd } from "@tabler/icons-react";
import { WebhookCredentials, regenerateApiPassword, testActBlueWebhook } from "@/services/webhookService";
import { toast } from "@/components/ui/use-toast";

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
  const [isTesting, setIsTesting] = useState(false);

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
          title: "API Password regenerated",
          description: "Your new API password has been generated. Make sure to update your ActBlue webhook settings."
        });
      } else {
        throw new Error("Failed to regenerate API password");
      }
    } catch (error) {
      console.error("Error regenerating API password:", error);
      toast({
        title: "Error regenerating password",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRegeneratingPassword(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookCredentials) return;
    
    setIsTesting(true);
    try {
      const success = await testActBlueWebhook(webhookCredentials.id);
      if (success) {
        toast({
          title: "Webhook test successful",
          description: "Your webhook configuration is working properly."
        });
      } else {
        toast({
          title: "Webhook test failed",
          description: "Please check your configuration and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Error testing webhook",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
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
            <CopyableInput id="apiUsername" value={webhookCredentials.api_username} label="API Username" />
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="apiPassword">API Password</Label>
                <Button variant="ghost" size="sm" onClick={handleRegeneratePassword} disabled={isRegeneratingPassword} className="h-8 px-2 text-xs">
                  <IconRefresh size={16} className="mr-1" />
                  {isRegeneratingPassword ? "Regenerating..." : "Regenerate"}
                </Button>
              </div>
              <CopyablePasswordInput id="apiPassword" value={webhookCredentials.api_password} />
              <p className="text-xs text-gray-500">
                For security reasons, we recommend regenerating your API password periodically.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleTestWebhook} 
                disabled={isTesting}
                variant="outline" 
                className="w-full"
              >
                <IconPlaylistAdd size={16} className="mr-2" />
                {isTesting ? "Testing..." : "Test Webhook Configuration"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Sends a test request to verify your webhook configuration is working correctly.
              </p>
            </div>
          </div> : <div className="py-4 text-center text-gray-500">
            Loading webhook credentials...
          </div>}
      </div>
    </div>;
};

export default WebhookConfig;
