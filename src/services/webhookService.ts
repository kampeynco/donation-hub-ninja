
import { supabase } from "@/integrations/supabase/client";

export interface WebhookCredentials {
  id: string;
  endpoint_url: string;
  api_username: string;
  api_password: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export const fetchWebhookCredentials = async (): Promise<WebhookCredentials | null> => {
  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .single();
  
  if (error) {
    console.error("Error fetching webhook credentials:", error);
    return null;
  }
  
  return data as WebhookCredentials;
};

export const updateWebhookCredentials = async (
  webhookId: string,
  updates: Partial<WebhookCredentials>
): Promise<boolean> => {
  const { error } = await supabase
    .from('webhooks')
    .update(updates)
    .eq('id', webhookId);
  
  if (error) {
    console.error("Error updating webhook credentials:", error);
    return false;
  }
  
  return true;
};

export const regenerateApiPassword = async (webhookId: string): Promise<string | null> => {
  // Generate a new random password
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
  let newPassword = "";
  for (let i = 0; i < 16; i++) {
    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Update the webhook with the new password
  const { error } = await supabase
    .from('webhooks')
    .update({ api_password: newPassword })
    .eq('id', webhookId);
  
  if (error) {
    console.error("Error regenerating API password:", error);
    return null;
  }
  
  return newPassword;
};

export const getWebhookEventStats = async (): Promise<{ total: number, processed: number, errors: number }> => {
  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('id')
    .single();
  
  if (webhookError || !webhook) {
    console.error("Error fetching webhook:", webhookError);
    return { total: 0, processed: 0, errors: 0 };
  }
  
  const { data: statsData, error: statsError } = await supabase
    .from('webhook_events')
    .select('processed, error')
    .eq('webhook_id', webhook.id);
  
  if (statsError) {
    console.error("Error fetching webhook stats:", statsError);
    return { total: 0, processed: 0, errors: 0 };
  }
  
  const total = statsData.length;
  const processed = statsData.filter(event => event.processed).length;
  const errors = statsData.filter(event => event.error).length;
  
  return { total, processed, errors };
};
