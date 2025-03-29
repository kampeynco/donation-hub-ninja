
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

export interface NotificationSettings {
  marketing_web: boolean;
  marketing_email: boolean;
  marketing_text: boolean;
  reports_web: boolean;
  reports_email: boolean;
  reports_text: boolean;
  donations_web: boolean;
  donations_email: boolean;
  donations_text: boolean;
  recurring_web: boolean;
  recurring_email: boolean;
  recurring_text: boolean;
}

export const useNotificationSettings = (userId: string | undefined) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    marketing_web: true,
    marketing_email: true,
    marketing_text: false,
    reports_web: true,
    reports_email: true,
    reports_text: false,
    donations_web: true,
    donations_email: true,
    donations_text: false,
    recurring_web: true,
    recurring_email: true,
    recurring_text: false
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchSettings();
      checkPhoneNumber();
    }
  }, [userId]);

  const fetchSettings = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching notification settings:', error);
        return;
      }
      
      if (data) {
        setSettings({
          marketing_web: data.marketing_web,
          marketing_email: data.marketing_email,
          marketing_text: data.marketing_text || false,
          reports_web: data.reports_web,
          reports_email: data.reports_email,
          reports_text: data.reports_text || false,
          donations_web: data.donations_web,
          donations_email: data.donations_email,
          donations_text: data.donations_text || false,
          recurring_web: data.recurring_web,
          recurring_email: data.recurring_email,
          recurring_text: data.recurring_text || false
        });
      }
    } catch (error) {
      console.error('Error in fetching notification settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const checkPhoneNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('mobile_phone')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setHasPhoneNumber(!!data.mobile_phone);
    } catch (error) {
      console.error('Error checking phone number:', error);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    // If trying to enable text notifications but no phone number is available
    if (key.endsWith('_text') && value && !hasPhoneNumber) {
      toast({
        title: "Phone Number Required",
        description: (
          <div className="flex items-center">
            <IconAlertCircle className="mr-2 h-4 w-4 text-amber-500" />
            <span>You need to add a mobile phone number in your profile to receive text notifications.</span>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('notification_settings')
        .update(settings)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: (
          <div className="flex items-center">
            <IconCheck className="mr-2 h-4 w-4 text-green-500" />
            <span>Your notification preferences have been updated</span>
          </div>
        ),
      });
    } catch (error: any) {
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

  return {
    settings,
    loading,
    initialLoading,
    hasPhoneNumber,
    handleToggle,
    saveSettings
  };
};
