
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  WebhookCredentials, 
  fetchWebhookCredentials
} from "@/services/webhookService";
import WebhookConfig from "./WebhookConfig";
import WebhookInstructions from "./WebhookInstructions";

const WebhooksTab = () => {
  const [webhookCredentials, setWebhookCredentials] = useState<WebhookCredentials | null>(null);
  const [actBlueWebhookUrl, setActBlueWebhookUrl] = useState<string>("");

  useEffect(() => {
    const loadWebhookCredentials = async () => {
      const credentials = await fetchWebhookCredentials();
      if (credentials) {
        setWebhookCredentials(credentials);
        setActBlueWebhookUrl(credentials.actblue_webhook_url || "");
      }
    };
    
    loadWebhookCredentials();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Integration</CardTitle>
        <CardDescription>
          Configure your ActBlue webhook integration to automatically sync donations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook Configuration */}
        <WebhookConfig 
          webhookCredentials={webhookCredentials}
          setWebhookCredentials={setWebhookCredentials}
          actBlueWebhookUrl={actBlueWebhookUrl}
          setActBlueWebhookUrl={setActBlueWebhookUrl}
        />

        <Separator className="my-6" />

        {/* ActBlue Integration Instructions */}
        <WebhookInstructions />
      </CardContent>
    </Card>
  );
};

export default WebhooksTab;
