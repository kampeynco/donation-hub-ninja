
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { DonationData, ProcessResult } from "../types.ts";
import { logDbOperation, handleDatabaseError } from "../utils.ts";
import { errorResponses } from "../../error-handler.ts";

/**
 * Creates a new donation record in the database
 */
export async function createDonation(
  supabase: ReturnType<typeof createClient>,
  donationData: DonationData,
  donorId: string | null,
  requestId: string,
  timestamp: string
): Promise<ProcessResult<{donationId: string, donationData: any}>> {
  try {
    console.log(`[${requestId}] Attempting to insert donation with data:`, JSON.stringify(donationData));
    
    const { data: newDonation, error: donationError } = await supabase
      .from("donations")
      .insert({
        ...donationData,
        donor_id: donorId,
      })
      .select()
      .single();
      
    if (donationError) {
      return handleDatabaseError(
        donationError, 
        "creating", 
        "donation", 
        requestId, 
        timestamp, 
        errorResponses.databaseError
      );
    }
    
    const donationId = newDonation.id;
    logDbOperation("Created donation", donationId, requestId, donorId ? `for donor: ${donorId}` : 'anonymous');
    
    return { success: true, data: { donationId, donationData: newDonation } };
  } catch (error) {
    return handleDatabaseError(
      error, 
      "creating", 
      "donation record", 
      requestId, 
      timestamp, 
      errorResponses.databaseError
    );
  }
}
