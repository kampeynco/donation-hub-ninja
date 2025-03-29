
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution, ActBlueDonor, ActBlueLineItem } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { ProcessResult } from "./types.ts";

import { extractDonationData, createDonation } from "./donation.ts";
import { extractDonorData, findOrCreateDonor, addDonorLocation } from "./donor.ts";
import { updateWebhookTimestamp } from "./webhook.ts";
import { createSuccessResponse } from "./response.ts";

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
    // Extract donation data
    const extractedDonation = extractDonationData(contribution, lineitems, requestId);
    if (!extractedDonation.success) {
      return { success: false, error: extractedDonation.error };
    }
    
    const donationData = extractedDonation.data;
    console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
    
    // Extract donor data
    const donorData = extractDonorData(donor, contribution);
    console.log(`[${requestId}] Processed donor data:`, JSON.stringify(donorData));

    // Find or create donor
    if (donor?.email) {
      const donorResult = await findOrCreateDonor(supabase, donor, donorData, requestId, timestamp);
      if (!donorResult.success) {
        return { success: false, error: donorResult.error };
      }
      
      const { donorId } = donorResult.data;
      
      // Create donation record
      const donationResult = await createDonation(supabase, donationData, donorId, requestId, timestamp);
      if (!donationResult.success) {
        return { success: false, error: donationResult.error };
      }
      
      const { donationId } = donationResult.data;
      
      // Add location if provided
      const locationResult = await addDonorLocation(supabase, donor, donorId, requestId);
      const { locationId } = locationResult;
      
      // Update webhook timestamp (non-critical)
      await updateWebhookTimestamp(supabase, timestamp, requestId);
      
      // Create success response
      const successResponse = createSuccessResponse(
        donationId, 
        donationData, 
        donorId, 
        donorData, 
        donor, 
        locationId, 
        requestId, 
        timestamp
      );
      
      return { success: true, data: successResponse, error: null };
    } else {
      // Handle anonymous donation (no email)
      const donationResult = await createDonation(supabase, donationData, null, requestId, timestamp);
      if (!donationResult.success) {
        return { success: false, error: donationResult.error };
      }
      
      const { donationId } = donationResult.data;
      
      // Update webhook timestamp (non-critical)
      await updateWebhookTimestamp(supabase, timestamp, requestId);
      
      // Create success response for anonymous donation
      const successResponse = createSuccessResponse(
        donationId, 
        donationData, 
        null, 
        null, 
        undefined, 
        null, 
        requestId, 
        timestamp
      );
      
      return { success: true, data: successResponse, error: null };
    }
  } catch (error) {
    console.error(`[${requestId}] Unexpected database error:`, error);
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
