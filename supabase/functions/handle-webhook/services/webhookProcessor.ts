
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueRequest } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { updateWebhookTimestamp } from "../models/index.ts";
import { processDonor } from "./donors/processDonor.ts";
import { processDonation } from "./donations/processDonation.ts";
import { sendNotification } from "./notifications/notificationService.ts";
import { formatDonorResponse } from "./formatters/responseFormatter.ts";
import { createSuccessResponse } from "./formatters/responseFormatter.ts";

/**
 * Process ActBlue webhook
 */
export async function processActBlueWebhook(
  supabase: ReturnType<typeof createClient>,
  data: ActBlueRequest,
  userId: string | null,
  requestId: string,
  timestamp: string
) {
  // Extract donation and donor data
  const donation = data.contribution;
  const lineItems = data.lineitems || [];
  const donor = data.donor;
  
  if (!donation) {
    console.error(`[${requestId}] No donation data found in request body`);
    return {
      success: false,
      error: errorResponses.invalidPayloadStructure(
        "No donation data provided", 
        "Missing contribution data", 
        requestId, 
        timestamp
      )
    };
  }

  console.log(`[${requestId}] Starting donation processing with contribution ID: ${donation.orderNumber}`);

  // Process donor if provided
  const { success: donorSuccess, donorResult, locationId, employerDataId, error: donorError } = 
    await processDonor(supabase, donor, donation, userId, requestId, timestamp);
  
  if (!donorSuccess) {
    return { success: false, error: donorError };
  }

  // Process donation
  const { success: donationSuccess, donationResult, donationData, error: donationError } = 
    await processDonation(
      supabase, 
      donation, 
      lineItems, 
      donorResult?.contactId || null, 
      requestId, 
      timestamp
    );
  
  if (!donationSuccess) {
    return { success: false, error: donationError };
  }

  // Send notification for the donation if contact exists and userId is provided
  // We only want to send notifications if we have both a contact ID and a user ID
  if (donorResult?.contactId && userId) {
    // Determine if this is a recurring donation by checking recurringPeriod
    const isRecurring = donationData.recurring_period && donationData.recurring_period !== 'once';
    
    // Extract actual donation amount from the lineitem or contribution
    const donationAmount = lineItems && lineItems.length > 0 
      ? parseFloat(lineItems[0].amount) 
      : donationData.amount;

    // Get the donor name or default to Anonymous
    const fullDonorName = donor?.firstname && donor?.lastname 
      ? `${donor.firstname} ${donor.lastname}` 
      : donor?.firstname || donor?.lastname || "Anonymous";
      
    // Send notification via edge function - this will handle both web and email notifications
    await sendNotification(
      supabase,
      userId,
      donationResult.donationId,
      donationAmount,
      donorResult.contactId,
      fullDonorName,
      donor?.email,
      isRecurring ? 'recurring' : 'one_time',
      requestId
    );
  }

  // Update webhook last_used_at timestamp
  await updateWebhookTimestamp(supabase, timestamp, requestId);

  // Format donor data for response
  const donorResponseData = formatDonorResponse(donorResult, donor, locationId, employerDataId);

  // Create and return success response
  const successResponse = createSuccessResponse(
    { id: donationResult.donationId, ...donationResult.donationData },
    donorResponseData,
    requestId,
    timestamp
  );

  console.log(`[${requestId}] Webhook processed successfully`);
  return { success: true, response: successResponse };
}
