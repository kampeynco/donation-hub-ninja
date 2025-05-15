
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution } from "../../types.ts";
import { DonationData } from "../../models/types.ts";

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

/**
 * Format donor information for response
 */
export function formatDonorResponse(
  donorResult: any, 
  donor: any, 
  locationId: string | null, 
  employerDataId: string | null
) {
  if (!donorResult?.contactId) {
    return null;
  }
  
  return { 
    id: donorResult.contactId, 
    ...donorResult.donorData,
    email: donor?.email,
    location: locationId ? {
      street: donor?.addr1,
      city: donor?.city,
      state: donor?.state,
      zip: donor?.zip,
      country: donor?.country
    } : null,
    employer_data: employerDataId && donor?.employerData ? {
      employer: donor.employerData.employer,
      occupation: donor.employerData.occupation
    } : null
  };
}

/**
 * Create a success response object for the webhook
 */
export function createSuccessResponse(
  donation: any,
  donor: any,
  requestId: string,
  timestamp: string
) {
  return {
    success: true,
    message: "Webhook processed successfully",
    data: {
      donation,
      donor
    },
    request_id: requestId,
    timestamp: timestamp
  };
}
