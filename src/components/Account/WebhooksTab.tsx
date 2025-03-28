
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  WebhookCredentials, 
  fetchWebhookCredentials, 
  getWebhookEventStats 
} from "@/services/webhookService";
import WebhookStats from "./WebhookStats";
import WebhookConfig from "./WebhookConfig";
import WebhookInstructions from "./WebhookInstructions";
import WebhookEventViewer from "./WebhookEventViewer";

const WebhooksTab = () => {
  const [webhookCredentials, setWebhookCredentials] = useState<WebhookCredentials | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookStats, setWebhookStats] = useState({ total: 0, processed: 0, errors: 0 });

  useEffect(() => {
    const loadWebhookCredentials = async () => {
      const credentials = await fetchWebhookCredentials();
      if (credentials) {
        setWebhookCredentials(credentials);
        setWebhookUrl(credentials.endpoint_url);
      }
      
      const stats = await getWebhookEventStats();
      setWebhookStats(stats);
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
        {/* Webhook Stats */}
        <WebhookStats 
          total={webhookStats.total} 
          processed={webhookStats.processed} 
          errors={webhookStats.errors} 
        />
        
        {/* Webhook Configuration */}
        <WebhookConfig 
          webhookCredentials={webhookCredentials}
          setWebhookCredentials={setWebhookCredentials}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
        />

        <Separator className="my-6" />

        {/* Webhook Event Viewer */}
        <WebhookEventViewer />

        <Separator className="my-6" />

        {/* ActBlue Integration Instructions */}
        <WebhookInstructions />
      </CardContent>
    </Card>
  );
};

export default WebhooksTab;
