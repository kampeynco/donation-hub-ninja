
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NotificationSection from "./NotificationSection";
import NotificationRow from "./NotificationRow";
import NotificationsLoading from "./NotificationsLoading";
import { useAuth } from "@/context/AuthContext";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const NotificationsTab: React.FC = () => {
  const { user } = useAuth();
  const { 
    settings, 
    loading, 
    initialLoading, 
    handleToggle, 
    saveSettings 
  } = useNotificationSettings(user?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {initialLoading ? (
          <NotificationsLoading />
        ) : (
          <>
            <NotificationSection title="Account Notifications">
              <NotificationRow
                id="marketing"
                title="Marketing Updates"
                description="Receive tips and updates about DonorCamp features"
                webChecked={settings.marketing_web}
                emailChecked={settings.marketing_email}
                textChecked={settings.marketing_text}
                onWebChange={(checked) => handleToggle('marketing_web', checked)}
                onEmailChange={(checked) => handleToggle('marketing_email', checked)}
                onTextChange={(checked) => handleToggle('marketing_text', checked)}
              />
              
              <NotificationRow
                id="reports"
                title="Weekly Reports"
                description="Receive a weekly summary of your account activity"
                webChecked={settings.reports_web}
                emailChecked={settings.reports_email}
                textChecked={settings.reports_text}
                onWebChange={(checked) => handleToggle('reports_web', checked)}
                onEmailChange={(checked) => handleToggle('reports_email', checked)}
                onTextChange={(checked) => handleToggle('reports_text', checked)}
              />
            </NotificationSection>
            
            <Separator className="my-4" />
            
            <NotificationSection 
              title="ActBlue Notifications" 
              showHeaders={true}
            >
              <NotificationRow
                id="donations"
                title="Donation Received"
                description="Receive a notification when a new donation is made"
                webChecked={settings.donations_web}
                emailChecked={settings.donations_email}
                textChecked={settings.donations_text}
                onWebChange={(checked) => handleToggle('donations_web', checked)}
                onEmailChange={(checked) => handleToggle('donations_email', checked)}
                onTextChange={(checked) => handleToggle('donations_text', checked)}
              />
              
              <NotificationRow
                id="recurring"
                title="Recurring Donations"
                description="Receive a notification when recurring donations are processed"
                webChecked={settings.recurring_web}
                emailChecked={settings.recurring_email}
                textChecked={settings.recurring_text}
                onWebChange={(checked) => handleToggle('recurring_web', checked)}
                onEmailChange={(checked) => handleToggle('recurring_email', checked)}
                onTextChange={(checked) => handleToggle('recurring_text', checked)}
              />
            </NotificationSection>
            
            <div className="flex justify-end mt-6">
              <Button onClick={saveSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
