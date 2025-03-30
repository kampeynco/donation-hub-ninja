
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { NotificationSettings, UserProfile } from "../types.ts";

// Configure Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getUserNotificationSettings(userId: string): Promise<NotificationSettings | null> {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error(`Error fetching notification settings: ${error.message}`);
    return null;
  }
  
  return data;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('committee_name, contact_first_name, contact_last_name, mobile_phone')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error(`Error fetching user profile: ${error.message}`);
    return null;
  }
  
  return data;
}

export async function getUserEmail(userId: string): Promise<string | null> {
  // Get user email from auth.users table
  const { data, error } = await supabase
    .auth
    .admin
    .getUserById(userId);
  
  if (error) {
    console.error(`Error fetching user email: ${error.message}`);
    return null;
  }
  
  return data.user?.email || null;
}

export async function createWebNotification(
  message: string,
  action: 'donation' | 'recurring_donation',
  donorId: string,
  requestId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .insert({
      message,
      action,
      donor_id: donorId,
      is_read: false
    });
  
  if (error) {
    console.error(`[${requestId}] Error creating web notification:`, error);
    return false;
  }
  
  console.log(`[${requestId}] Web notification created successfully`);
  return true;
}
