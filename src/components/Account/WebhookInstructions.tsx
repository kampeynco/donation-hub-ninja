
import { Separator } from "@/components/ui/separator";

const WebhookInstructions = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">ActBlue Integration Instructions</h3>
      <p className="text-sm text-gray-500 mb-2">
        Use the information below to configure ActBlue to receive real-time notifications.
      </p>
      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-medium">Setup Instructions</h4>
        <ol className="space-y-3 text-sm text-gray-500">
          <li>
            <span className="font-medium">Step 1.</span> Log into your ActBlue account, navigate to the left sidebar and click on "Integrations".
          </li>
          <li>
            <span className="font-medium">Step 2.</span> Click the "Manage" link inside the Webhooks card.
          </li>
          <li>
            <span className="font-medium">Step 3.</span> Click the "Request a new webhook" button on the right side of the Webhooks page.
          </li>
          <li>
            <span className="font-medium">Step 4.</span> Select "ActBlue Default" in the dropdown menu, then click the "Next" button.
          </li>
          <li>
            <span className="font-medium">Step 5.</span> Copy and paste the details on the right into the fields on the New Webhook page, then click the "Submit request" button.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default WebhookInstructions;
