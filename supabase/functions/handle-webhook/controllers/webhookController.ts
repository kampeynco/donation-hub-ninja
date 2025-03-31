
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueRequest } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { 
  extractDonationData, 
  createDonation,
  processCustomFields,
  processMerchandise
} from "../models/index.ts";
import { 
  extractDonorData, 
  findOrCreateDonor, 
  addDonorLocation, 
  addEmployerData 
} from "../models/index.ts";
import { createDonationNotification, updateWebhookTimestamp } from "../models/index.ts";
import { corsHeaders } from "../utils/corsHeaders.ts";

/**
 * Process a donor from ActBlue webhook data
 */
export async function processDonor(
  supabase: ReturnType<typeof createClient>,
  donor: any,
  donation: any,
  userId: string | null,
  requestId: string,
  timestamp: string
) {
  if (!donor) {
    console.log(`[${requestId}] No donor data provided, processing as anonymous donation`);
    return { success: true, donorResult: null, locationId: null, employerDataId: null };
  }

  console.log(`[${requestId}] Processing donor with email: ${donor.email}`);
  const donorData = extractDonorData(donor, donation);
  console.log(`[${requestId}] Processed donor data: ${JSON.stringify(donorData)}`);
  
  const donorResult = await findOrCreateDonor(supabase, donor, donorData, requestId, timestamp, userId);

  if (!donorResult.success) {
    return { 
      success: false, 
      error: donorResult.error, 
      donorResult: null, 
      locationId: null, 
      employerDataId: null 
    };
  }

  // Only proceed with location if we have a valid donor
  let locationId = null;
  let employerDataId = null;

  if (donorResult.data?.donorId) {
    const locationResult = await addDonorLocation(
      supabase, 
      donor, 
      donorResult.data.donorId, 
      requestId, 
      timestamp
    );
    
    if (locationResult.success && locationResult.data) {
      locationId = locationResult.data.locationId;
    }

    const employerResult = await addEmployerData(
      supabase, 
      donor, 
      donorResult.data.donorId, 
      requestId, 
      timestamp
    );
    
    if (employerResult.success && employerResult.data) {
      employerDataId = employerResult.data.employerDataId;
    }
  }

  return { 
    success: true, 
    donorResult: donorResult.data, 
    locationId, 
    employerDataId 
  };
}

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

/**
 * Create a success response for the webhook
 */
export function createSuccessResponse(
  donationData: any,
  donorData: any,
  requestId: string,
  timestamp: string
) {
  return {
    success: true,
    message: donorData ? "Donation processed successfully" : "Anonymous donation processed successfully",
    donation: donationData,
    donor: donorData,
    request_id: requestId,
    timestamp: timestamp
  };
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
  if (!donorResult?.donorId) {
    return null;
  }
  
  return { 
    id: donorResult.donorId, 
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
      donorResult?.donorId || null, 
      requestId, 
      timestamp
    );
  
  if (!donationSuccess) {
    return { success: false, error: donationError };
  }

  // Create notification for the donation if donor exists
  if (donorResult?.donorId) {
    await createDonationNotification(
      supabase, 
      donation, 
      donor, 
      donorResult.donorId,
      donationData, // Pass the processed donation data
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
