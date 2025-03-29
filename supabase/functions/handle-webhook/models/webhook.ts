
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { logDbOperation } from "./utils.ts";

/**
 * Updates the webhook last_used_at timestamp
 */
export async function updateWebhookTimestamp(
  supabase: ReturnType<typeof createClient>,
  timestamp: string,
  requestId: string
) {
  try {
    const { error: webhookError } = await supabase
      .from("webhooks")
      .update({ last_used_at: timestamp })
      .eq("is_active", true);
      
    if (webhookError) {
      // Non-critical error, just log it
      console.error(`[${requestId}] Error updating webhook last_used_at:`, webhookError);
    } else {
      logDbOperation("Updated webhook timestamp", "active webhook", requestId);
    }
  } catch (webhookUpdateError) {
    // Non-critical error, just log it
    console.error(`[${requestId}] Unexpected error updating webhook timestamp:`, webhookUpdateError);
  }
}
