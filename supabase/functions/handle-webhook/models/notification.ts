
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution } from "../types.ts";
import { ProcessResult } from "./types.ts";

/**
 * Creates a notification for a new donation
 */
export async function createDonationNotification(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donor: ActBlueDonor | undefined,
  donorId: string | null,
  requestId: string
): Promise<ProcessResult<{id: string}>> {
  try {
    if (!donorId) {
      console.log(`[${requestId}] No donor ID provided for notification, skipping`);
      return { success: true, data: { id: '' }};
    }
    
    // Build the donor name or use "Anonymous"
    const donorName = donor?.firstName && donor?.lastName 
      ? `${donor.firstName} ${donor.lastName}`
      : donor?.firstName || donor?.lastName || "Anonymous";
    
    // Check if this is a recurring donation
    const isRecurring = contribution.recurringDuration && contribution.recurringPeriod !== 'once';
    const action = 'donor'; // Use 'donor' action type for all donation notifications
    
    // Build message based on donation type
    let message = '';
    if (isRecurring) {
      message = `${donorName} set up a ${contribution.recurringPeriod} donation of $${Number(contribution.amount).toFixed(2)}`;
    } else {
      message = `${donorName} donated $${Number(contribution.amount).toFixed(2)}`;
    }
    
    // Create the notification
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        message,
        action,
        donor_id: donorId,
        date: new Date().toISOString(),
        is_read: false
      })
      .select()
      .single();
      
    if (error) {
      console.error(`[${requestId}] Error creating notification:`, error);
      return { success: true, data: { id: '' }}; // Non-critical error, still return success
    }
    
    console.log(`[${requestId}] Created ${isRecurring ? 'recurring donation' : 'donation'} notification for donor ${donorId}`);
    return { success: true, data: { id: data.id }};
  } catch (error) {
    console.error(`[${requestId}] Error in createDonationNotification:`, error);
    return { success: true, data: { id: '' }}; // Non-critical error, still return success
  }
}
