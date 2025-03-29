
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { logDbOperation } from "./utils.ts";

interface DonationNotificationData {
  donationId: string;
  amount: number;
  donorId: string;
  donorName: string | null;
  donorEmail: string | undefined;
  donationType: 'recurring' | 'one_time';
}

/**
 * Dispatches notification to the send-notification edge function
 */
export async function sendDonationNotification(
  supabase: ReturnType<typeof createClient>,
  data: DonationNotificationData,
  requestId: string
): Promise<void> {
  try {
    logDbOperation("Sending donation notification", data.donationId, requestId);
    
    // Get the donation owner (committee) from the database
    const { data: webhookData, error: webhookError } = await supabase
      .from('webhooks')
      .select('user_id')
      .limit(1)
      .single();
    
    if (webhookError) {
      console.error(`[${requestId}] Error getting webhook user_id:`, webhookError);
      return;
    }
    
    const userId = webhookData.user_id;
    
    // Call the send-notification edge function
    const { error } = await supabase.functions.invoke('send-notification', {
      body: {
        userId,
        donationId: data.donationId,
        amount: data.amount,
        donorId: data.donorId,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donationType: data.donationType,
        requestId
      }
    });
    
    if (error) {
      throw new Error(`Failed to invoke send-notification function: ${error.message}`);
    }
    
    logDbOperation("Notification sent successfully", data.donationId, requestId);
  } catch (error) {
    console.error(`[${requestId}] Error sending notification:`, error);
    // This is non-critical, so we don't throw the error
  }
}
