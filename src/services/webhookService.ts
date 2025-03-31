
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface WebhookCredentials {
  id: string;
  api_username: string;
  api_password: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  hookdeck_source_id: string | null;
  hookdeck_connection_id: string | null;
  hookdeck_destination_url: string;
  actblue_webhook_url: string | null;
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

export const updateActBlueWebhookUrl = async (webhookId: string, url: string): Promise<boolean> => {
  try {
    // Update the ActBlue webhook URL in our database
    const { error } = await supabase
      .from('webhooks')
      .update({ actblue_webhook_url: url })
      .eq('id', webhookId);
    
    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
    
    // We also need to update the Hookdeck source URL
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('hookdeck_source_id')
      .eq('id', webhookId)
      .single();
    
    if (webhook?.hookdeck_source_id) {
      // Call our edge function to update the Hookdeck source URL
      const response = await supabase.functions.invoke('update-hookdeck-source', {
        body: { 
          sourceId: webhook.hookdeck_source_id,
          url: url 
        }
      });
      
      if (response.error) {
        throw new Error(`Hookdeck update failed: ${response.error}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating ActBlue webhook URL:", error);
    toast({
      title: "Error updating webhook URL",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const testActBlueWebhook = async (webhookId: string): Promise<boolean> => {
  try {
    // Call our edge function to test the ActBlue webhook
    const response = await supabase.functions.invoke('test-actblue-webhook', {
      body: { webhookId }
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    toast({
      title: "Webhook test successful",
      description: "Your ActBlue webhook is properly configured",
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

export const createHookdeckWebhook = async (userId: string, email: string): Promise<string | null> => {
  try {
    // Call our edge function to create the Hookdeck webhook
    const response = await supabase.functions.invoke('create-hookdeck-webhook', {
      body: { 
        userId, 
        email 
      }
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data.hookdeckSourceUrl;
  } catch (error) {
    console.error("Error creating Hookdeck webhook:", error);
    return null;
  }
};

export const deleteHookdeckSource = async (sourceId: string, userId?: string): Promise<boolean> => {
  try {
    // Call our edge function to delete the Hookdeck source
    const response = await supabase.functions.invoke('delete-hookdeck-source', {
      body: { 
        sourceId,
        userId 
      }
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    toast({
      title: "Webhook source deleted",
      description: "The Hookdeck webhook source was successfully deleted",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting Hookdeck source:", error);
    toast({
      title: "Error deleting webhook source",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};
