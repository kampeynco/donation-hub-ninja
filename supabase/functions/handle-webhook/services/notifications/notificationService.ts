
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

/**
 * Send a notification for the donation
 */
export async function sendNotification(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  donationId: string,
  amount: number,
  contactId: string,
  donorName: string | null,
  donorEmail: string | undefined,
  donationType: 'recurring' | 'one_time',
  requestId: string
) {
  try {
    // Call the send-notification function
    const { error } = await supabase.functions.invoke('send-notification', {
      body: {
        userId,
        donationId,
        amount,
        contactId,
        donorName,
        donorEmail,
        donationType,
        actionType: donationType === 'recurring' ? 'recurring_donation' : 'donation',
        requestId
      }
    });

    if (error) {
      console.error(`[${requestId}] Error sending notification:`, error);
      return { success: false };
    }

    console.log(`[${requestId}] Notification sent successfully for ${donationType} donation`);
    return { success: true };
  } catch (err) {
    console.error(`[${requestId}] Exception in sendNotification:`, err);
    return { success: false };
  }
}
