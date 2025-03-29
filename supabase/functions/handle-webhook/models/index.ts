
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution, ActBlueDonor, ActBlueLineItem } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { ProcessResult } from "./types.ts";

import { extractDonationData, createDonation, processCustomFields, processMerchandise } from "./donation.ts";
import { extractDonorData, findOrCreateDonor, addDonorLocation, addEmployerData } from "./donor.ts";
import { updateWebhookTimestamp } from "./webhook.ts";
import { createSuccessResponse } from "./response.ts";
import { sendDonationNotification } from "./notification.ts";

/**
 * Processes an ActBlue donation and saves it to the database
 */
export async function processDonation(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donor: ActBlueDonor | undefined,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string,
  timestamp: string
): Promise<ProcessResult> {
  try {
    console.log(`[${requestId}] Starting donation processing with contribution ID: ${contribution.orderNumber}`);
    
    // Extract donation data
    const extractedDonation = extractDonationData(contribution, lineitems, requestId);
    if (!extractedDonation.success) {
      console.error(`[${requestId}] Failed to extract donation data:`, extractedDonation.error);
      return { success: false, error: extractedDonation.error };
    }
    
    const donationData = extractedDonation.data;
    console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
    
    // Extract donor data
    const donorData = extractDonorData(donor, contribution);
    console.log(`[${requestId}] Processed donor data:`, JSON.stringify(donorData));

    // Find or create donor
    let donorId = null;
    let locationId = null;
    let employerDataId = null;
    
    if (donor?.email) {
      console.log(`[${requestId}] Processing donor with email: ${donor.email}`);
      const donorResult = await findOrCreateDonor(supabase, donor, donorData, requestId, timestamp);
      if (!donorResult.success) {
        console.error(`[${requestId}] Failed to process donor:`, donorResult.error);
        return { success: false, error: donorResult.error };
      }
      
      donorId = donorResult.data.donorId;
      
      // Add location if provided
      if (donorId) {
        const locationResult = await addDonorLocation(supabase, donor, donorId, requestId);
        locationId = locationResult.locationId;
        
        // Add employer data if provided
        const employerResult = await addEmployerData(supabase, donor, donorId, requestId);
        employerDataId = employerResult.employerDataId;
      }
    } else {
      console.log(`[${requestId}] Processing anonymous donation (no email provided)`);
    }
    
    // Create donation record
    const donationResult = await createDonation(supabase, donationData, donorId, requestId, timestamp);
    if (!donationResult.success) {
      console.error(`[${requestId}] Failed to create donation:`, donationResult.error);
      return { success: false, error: donationResult.error };
    }
    
    const { donationId, donationData: savedDonation } = donationResult.data;
    console.log(`[${requestId}] Successfully created donation with ID: ${donationId}`);
    
    // Process custom fields (non-critical)
    await processCustomFields(supabase, contribution, donationId, requestId);
    
    // Process merchandise items (non-critical)
    await processMerchandise(supabase, contribution, donationId, requestId);
    
    // Update webhook timestamp (non-critical)
    try {
      await updateWebhookTimestamp(supabase, timestamp, requestId);
    } catch (e) {
      console.error(`[${requestId}] Non-critical error updating webhook timestamp:`, e);
      // Continue processing, this is non-critical
    }
    
    // Determine donation type for notification based on recurring_period (primary check)
    // or recurringDuration (backup check)
    const isRecurring = (
      savedDonation.recurring_period === 'monthly' || 
      savedDonation.recurring_period === 'weekly' ||
      (savedDonation.recurring_period === 'once' && savedDonation.recurring_duration > 1)
    );
    
    // Send notifications (non-critical)
    try {
      if (donorId) {
        // Pass donation data for notification
        await sendDonationNotification(
          supabase,
          {
            donationId,
            amount: savedDonation.amount,
            donorId,
            donorName: donorData.first_name ? `${donorData.first_name} ${donorData.last_name || ''}` : null,
            donorEmail: donor?.email,
            donationType: isRecurring ? 'recurring' : 'one_time'
          },
          requestId
        );
      }
    } catch (e) {
      console.error(`[${requestId}] Non-critical error sending notifications:`, e);
      // Continue processing, this is non-critical
    }
    
    // Create success response
    const successResponse = createSuccessResponse(
      donationId, 
      savedDonation, 
      donorId, 
      donorData, 
      donor, 
      locationId,
      employerDataId,
      requestId, 
      timestamp
    );
    
    console.log(`[${requestId}] Webhook processing completed successfully`);
    return { success: true, data: successResponse };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in processDonation:`, error);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Database operation failed",
        error.message,
        requestId,
        timestamp
      )
    };
  }
}
