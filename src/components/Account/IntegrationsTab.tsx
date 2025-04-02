
import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { IconCreditCard } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { WebhookCredentials, fetchWebhookCredentials } from "@/services/webhookService";
import IntegrationCard from "./IntegrationCard";
import WebhookConfig from "./WebhookConfig";
import WebhookInstructions from "./WebhookInstructions";
import { getActBlueLogo } from "@/services/actBlueService";

const IntegrationsTab = () => {
  const [webhookCredentials, setWebhookCredentials] = useState<WebhookCredentials | null>(null);
  const [actBlueWebhookUrl, setActBlueWebhookUrl] = useState<string>("");
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [actBlueLogoUrl, setActBlueLogoUrl] = useState<string>("https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_actblue_icon.png");

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

  const isConnected = Boolean(webhookCredentials?.actblue_webhook_url);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect and manage third-party integrations for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IntegrationCard
            title="ActBlue"
            description="Connect your ActBlue account to automatically sync donations"
            icon={<IconCreditCard size={24} className="text-primary" />}
            logoUrl={actBlueLogoUrl}
            onConnectClick={() => setConfigModalOpen(true)}
            onInstructionsClick={() => setInstructionsModalOpen(true)}
            connected={isConnected}
          />
          
          {/* Additional integration cards can be added here */}
        </div>

        {/* Configuration Modal */}
        <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>ActBlue Integration Configuration</DialogTitle>
              <DialogDescription>
                Configure your ActBlue webhook integration
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <WebhookConfig
                webhookCredentials={webhookCredentials}
                setWebhookCredentials={setWebhookCredentials}
                actBlueWebhookUrl={actBlueWebhookUrl}
                setActBlueWebhookUrl={setActBlueWebhookUrl}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Instructions Modal */}
        <Dialog open={instructionsModalOpen} onOpenChange={setInstructionsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>ActBlue Integration Instructions</DialogTitle>
              <DialogDescription>
                Follow these steps to set up your ActBlue integration
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <WebhookInstructions />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
