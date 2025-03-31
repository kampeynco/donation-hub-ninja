
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution } from "../types.ts";
import { ProcessResult, DonationData } from "./types.ts";

/**
 * Creates a notification for a new donation
 */
export async function createDonationNotification(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donor: ActBlueDonor | undefined,
  donorId: string | null,
  donationData: DonationData,
  requestId: string
): Promise<ProcessResult<{id: string}>> {
  try {
    if (!donorId) {
      console.log(`[${requestId}] No donor ID provided for notification, skipping`);
      return { success: true, data: { id: '' }};
    }
    
    // Build the donor name or use "Anonymous" - fix casing issue (firstname vs firstName)
    const donorName = donor?.firstname && donor?.lastname 
      ? `${donor.firstname} ${donor.lastname}`
      : donor?.firstname || donor?.lastname || "Anonymous";
    
    // Check if this is a recurring donation
    const isRecurring = contribution.recurringDuration && contribution.recurringPeriod !== 'once';
    
    // Extract donation amount from the DonationData
    const amount = donationData.amount;
    const formattedAmount = amount.toFixed(2);
    
    // Build message based on donation type
    let message = '';
    if (isRecurring) {
      message = `${donorName} set up a ${contribution.recurringPeriod} donation of $${formattedAmount}`;
    } else {
      message = `${donorName} donated $${formattedAmount}`;
    }
    
    console.log(`[${requestId}] Creating notification with message: ${message}`);
    
    // Create the notification with the donor action type (matches the enum in the database)
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        message,
        action: 'donor', // Updated to match the notification_action enum in the database
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
