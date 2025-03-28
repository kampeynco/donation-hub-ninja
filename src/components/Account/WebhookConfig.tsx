
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { IconRefresh } from "@tabler/icons-react";
import { WebhookCredentials, updateWebhookCredentials, regenerateApiPassword, testWebhook } from "@/services/webhookService";
import { toast } from "@/components/ui/use-toast";

interface WebhookConfigProps {
  webhookCredentials: WebhookCredentials | null;
  setWebhookCredentials: React.Dispatch<React.SetStateAction<WebhookCredentials | null>>;
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
}

const WebhookConfig = ({
  webhookCredentials,
  setWebhookCredentials,
  webhookUrl,
  setWebhookUrl
}: WebhookConfigProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingPassword, setIsRegeneratingPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveWebhookUrl = async () => {
    if (!webhookCredentials) return;
    
    setIsLoading(true);
    try {
      const success = await updateWebhookCredentials(webhookCredentials.id, { 
        endpoint_url: webhookUrl 
      });
      
      if (success) {
        setWebhookCredentials({
          ...webhookCredentials,
          endpoint_url: webhookUrl
        });
        
        toast({
          title: "Webhook URL updated",
          description: "Your webhook endpoint has been updated successfully."
        });
      } else {
        throw new Error("Failed to update webhook URL");
      }
    } catch (error) {
      console.error("Error updating webhook URL:", error);
      toast({
        title: "Error updating webhook URL",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingPassword(false);
    }
  };
  
  const handleTestWebhook = async () => {
    if (!webhookCredentials) return;
    
    setIsTesting(true);
    try {
      await testWebhook(webhookCredentials.id);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">ActBlue Webhook URL</Label>
        <div className="flex gap-2">
          <Input
            id="webhookUrl"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-actblue-webhook-url.com"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleSaveWebhookUrl}
            disabled={isLoading || !webhookCredentials}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestWebhook}
            disabled={isTesting || !webhookCredentials}
          >
            {isTesting ? "Testing..." : "Test"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          This is where DonorCamp will send ActBlue donation data. Configure this in your ActBlue webhook settings.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="font-medium">DonorCamp API Credentials</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use these credentials in your ActBlue webhook settings to authenticate requests to DonorCamp.
        </p>
        
        {webhookCredentials ? (
          <div className="space-y-4">
            <CopyableInput 
              id="apiEndpoint" 
              value="https://api.donorcamp.com/v1" 
              label="API Endpoint" 
            />
            
            <CopyableInput 
              id="apiUsername" 
              value={webhookCredentials.api_username} 
              label="API Username" 
            />
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="apiPassword">API Password</Label>
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
                For security reasons, we recommend regenerating your API password periodically.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Loading webhook credentials...
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookConfig;
