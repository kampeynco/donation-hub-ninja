
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

const WebhookInstructions = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">ActBlue Integration Instructions</h3>
      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-medium">Step 1: Access ActBlue Dashboard</h4>
        <p className="text-sm text-gray-500">
          Log into your ActBlue account and navigate to the Webhook settings section.
        </p>
        
        <h4 className="font-medium">Step 2: Configure Webhook</h4>
        <p className="text-sm text-gray-500">
          Enter the DonorCamp API Endpoint, Username, and Password from above into ActBlue's webhook configuration.
        </p>
        
        <h4 className="font-medium">Step 3: Select Events</h4>
        <p className="text-sm text-gray-500">
          Enable webhook notifications for donation events in ActBlue's settings.
        </p>
        
        <h4 className="font-medium">Step 4: Test Integration</h4>
        <p className="text-sm text-gray-500">
          Use ActBlue's test feature to verify the webhook is properly configured.
        </p>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <span>View ActBlue Integration Guide</span>
            <IconArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebhookInstructions;
