
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NotificationSection from "./NotificationSection";
import NotificationRow from "./NotificationRow";

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationSection title="Account Notifications">
          <NotificationRow
            id="marketing"
            title="Marketing Updates"
            description="Receive tips and updates about DonorCamp features"
            webChecked={true}
            emailChecked={true}
          />
          
          <NotificationRow
            id="reports"
            title="Weekly Reports"
            description="Receive a weekly summary of your account activity"
            webChecked={true}
            emailChecked={true}
          />
        </NotificationSection>
        
        <Separator className="my-4" />
        
        <NotificationSection 
          title="ActBlue Notifications" 
          showHeaders={false}
        >
          <NotificationRow
            id="donations"
            title="Donation Received"
            description="Receive a notification when a new donation is made"
            webChecked={true}
            emailChecked={true}
          />
          
          <NotificationRow
            id="recurring"
            title="Recurring Donations"
            description="Receive a notification when recurring donations are processed"
            webChecked={true}
            emailChecked={true}
          />
        </NotificationSection>
        
        <div className="flex justify-end mt-6">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
