
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { 
  extractDonationData, 
  createDonation,
  processCustomFields,
  processMerchandise
} from "../models/index.ts";

/**
 * Process a donation from ActBlue webhook data
 */
export async function processDonation(
  supabase: ReturnType<typeof createClient>,
  donation: any,
  lineItems: any[],
  donorId: string | null,
  requestId: string,
  timestamp: string
) {
  const donationDataResult = extractDonationData(donation, lineItems, requestId);
  
  if (!donationDataResult.success) {
    return { success: false, error: donationDataResult.error, donationResult: null };
  }

  // Process donation 
  const donationResult = await createDonation(
    supabase, 
    donationDataResult.data, 
    donorId, 
    requestId, 
    timestamp
  );

  if (!donationResult.success) {
    return { success: false, error: donationResult.error, donationResult: null };
  }

  // Process custom fields if any
  if (donation.customFields && donation.customFields.length > 0) {
    await processCustomFields(
      supabase,
      donation,
      donationResult.data.donationId,
      requestId
    );
  }

  // Process merchandise if any
  if (donation.merchandise && donation.merchandise.length > 0) {
    await processMerchandise(
      supabase,
      donation,
      donationResult.data.donationId,
      requestId
    );
  }

  return { success: true, donationResult: donationResult.data, donationData: donationDataResult.data };
}
