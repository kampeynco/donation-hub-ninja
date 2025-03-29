
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { IconCheck } from "@tabler/icons-react";
import NotificationSection from "./NotificationSection";
import NotificationRow from "./NotificationRow";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const NotificationsTab = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    marketing_web: true,
    marketing_email: true,
    reports_web: true,
    reports_email: true,
    donations_web: true,
    donations_email: true,
    recurring_web: true,
    recurring_email: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching notification settings:', error);
        return;
      }
      
      if (data) {
        setSettings({
          marketing_web: data.marketing_web,
          marketing_email: data.marketing_email,
          reports_web: data.reports_web,
          reports_email: data.reports_email,
          donations_web: data.donations_web,
          donations_email: data.donations_email,
          recurring_web: data.recurring_web,
          recurring_email: data.recurring_email
        });
      }
    } catch (error) {
      console.error('Error in fetching notification settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleToggle = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('notification_settings')
        .update(settings)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
        icon: <IconCheck size={18} />,
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Failed to save",
        description: error.message || "There was an error saving your preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="py-6 text-center text-muted-foreground">
            Loading your notification preferences...
          </div>
        ) : (
          <>
            <NotificationSection title="Account Notifications">
              <NotificationRow
                id="marketing"
                title="Marketing Updates"
                description="Receive tips and updates about DonorCamp features"
                webChecked={settings.marketing_web}
                emailChecked={settings.marketing_email}
                onWebChange={(checked) => handleToggle('marketing_web', checked)}
                onEmailChange={(checked) => handleToggle('marketing_email', checked)}
              />
              
              <NotificationRow
                id="reports"
                title="Weekly Reports"
                description="Receive a weekly summary of your account activity"
                webChecked={settings.reports_web}
                emailChecked={settings.reports_email}
                onWebChange={(checked) => handleToggle('reports_web', checked)}
                onEmailChange={(checked) => handleToggle('reports_email', checked)}
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
                webChecked={settings.donations_web}
                emailChecked={settings.donations_email}
                onWebChange={(checked) => handleToggle('donations_web', checked)}
                onEmailChange={(checked) => handleToggle('donations_email', checked)}
              />
              
              <NotificationRow
                id="recurring"
                title="Recurring Donations"
                description="Receive a notification when recurring donations are processed"
                webChecked={settings.recurring_web}
                emailChecked={settings.recurring_email}
                onWebChange={(checked) => handleToggle('recurring_web', checked)}
                onEmailChange={(checked) => handleToggle('recurring_email', checked)}
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
