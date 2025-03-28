
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface WebhookCredentials {
  id: string;
  endpoint_url: string;
  api_username: string;
  api_password: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface WebhookEvent {
  id: string;
  event_type: string;
  payload: any;
  processed: boolean;
  error: string | null;
  created_at: string;
  processed_at: string | null;
  webhook_id: string;
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

export const testWebhook = async (webhookId: string): Promise<boolean> => {
  try {
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('endpoint_url, api_username, api_password')
      .eq('id', webhookId)
      .single();
    
    if (!webhook) {
      toast({
        title: "Error testing webhook",
        description: "Webhook credentials not found",
        variant: "destructive",
      });
      return false;
    }
    
    // Send a test request to the ActBlue webhook URL
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      message: "This is a test webhook from DonorCamp"
    };
    
    const response = await fetch(webhook.endpoint_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${webhook.api_username}:${webhook.api_password}`)}`
      },
      body: JSON.stringify(testPayload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast({
      title: "Webhook test successful",
      description: "Your webhook endpoint responded correctly",
    });
    
    return true;
  } catch (error) {
    console.error("Error testing webhook:", error);
    toast({
      title: "Webhook test failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
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

export const fetchWebhookEvents = async (
  limit: number = 10, 
  page: number = 1,
  searchTerm: string = ""
): Promise<{ events: WebhookEvent[], total: number }> => {
  const startIndex = (page - 1) * limit;
  
  // First get the webhook id
  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('id')
    .single();
  
  if (webhookError || !webhook) {
    console.error("Error fetching webhook:", webhookError);
    return { events: [], total: 0 };
  }
  
  // Query with filters and pagination
  let query = supabase
    .from('webhook_events')
    .select('*', { count: 'exact' })
    .eq('webhook_id', webhook.id)
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + limit - 1);
  
  // Add search filter if provided
  if (searchTerm) {
    query = query.or(`event_type.ilike.%${searchTerm}%,payload.ilike.%${searchTerm}%`);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error("Error fetching webhook events:", error);
    return { events: [], total: 0 };
  }
  
  return { 
    events: data as WebhookEvent[], 
    total: count || 0 
  };
};

export const getWebhookEvent = async (eventId: string): Promise<WebhookEvent | null> => {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  if (error) {
    console.error("Error fetching webhook event:", error);
    return null;
  }
  
  return data as WebhookEvent;
};
