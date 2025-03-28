
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-donations">Donation Received</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when a new donation is made
                </p>
              </div>
              <input type="checkbox" id="email-donations" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive tips and updates about DonorCamp features
                </p>
              </div>
              <input type="checkbox" id="email-marketing" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your donations and platform activity
                </p>
              </div>
              <input type="checkbox" id="email-reports" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Push Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-all">All Activities</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for all account activities
                  </p>
                </div>
                <input type="checkbox" id="push-all" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-mentioned">Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Only when you're mentioned in comments
                  </p>
                </div>
                <input type="checkbox" id="push-mentioned" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
