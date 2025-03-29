
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution, ActBlueLineItem, WebhookSuccessResponse } from "./types.ts";
import { errorResponses } from "./error-handler.ts";

/**
 * Extracts donation data from the ActBlue contribution and line items
 */
function extractDonationData(
  contribution: ActBlueContribution,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string
) {
  // Get the first line item for the amount if not in contribution
  const lineItem = lineitems && lineitems.length > 0 ? lineitems[0] : null;
  
  if (!lineItem && !contribution.amount) {
    console.error(`[${requestId}] Missing donation amount in payload`);
    return { 
      success: false, 
      error: errorResponses.invalidPayloadStructure(
        "Donation amount not found",
        "Neither contribution.amount nor lineitem.amount is present",
        requestId
      )
    };
  }
  
  // Extract relevant data from the contribution
  const donationData = {
    amount: parseFloat(lineItem?.amount || contribution.amount || "0"),
    paid_at: new Date(lineItem?.paidAt || contribution.paidAt || contribution.createdAt).toISOString(),
    is_mobile: contribution.isMobile || false,
    recurring_period: contribution.recurringPeriod === 'monthly' ? 'monthly' : 
                     contribution.recurringPeriod === 'weekly' ? 'weekly' : 'once',
    recurring_duration: contribution.recurringDuration || 0,
    express_signup: contribution.expressSignup || false,
    is_express: contribution.isExpress || false,
    payment_type: contribution.isPaypal ? 'paypal' : 'credit',
    is_paypal: contribution.isPaypal || false,
  };

  return { success: true, data: donationData };
}

/**
 * Extracts donor information from the ActBlue donor and contribution
 */
function extractDonorData(
  donor: ActBlueDonor | undefined,
  contribution: ActBlueContribution
) {
  return {
    first_name: donor?.firstname || null,
    last_name: donor?.lastname || null,
    is_express: contribution.isExpress || false,
    is_mobile: contribution.isMobile || false,
    is_paypal: contribution.isPaypal || false,
  };
}

/**
 * Finds or creates a donor by email in the database
 */
async function findOrCreateDonor(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorData: any,
  requestId: string,
  timestamp: string
) {
  if (!donor?.email) {
    console.log(`[${requestId}] Anonymous donation - no email provided`);
    return { success: true, donorId: null };
  }

  try {
    // Try to find existing donor by email
    const { data: existingEmail, error: emailError } = await supabase
      .from("emails")
      .select("donor_id, email")
      .eq("email", donor.email)
      .maybeSingle();
    
    if (emailError) {
      console.error(`[${requestId}] Database error looking up donor email:`, emailError);
      return { 
        success: false, 
        error: errorResponses.databaseError(
          "Error looking up donor email",
          emailError.message,
          requestId,
          timestamp
        )
      };
    }

    let donorId;
    let emailId;

    if (existingEmail?.donor_id) {
      // Update existing donor
      donorId = existingEmail.donor_id;
      const { error: donorUpdateError } = await supabase
        .from("donors")
        .update(donorData)
        .eq("id", donorId);
      
      if (donorUpdateError) {
        console.error(`[${requestId}] Database error updating donor:`, donorUpdateError);
        return { 
          success: false, 
          error: errorResponses.databaseError(
            "Error updating donor",
            donorUpdateError.message,
            requestId,
            timestamp
          )
        };
      }
      
      console.log(`[${requestId}] Updated existing donor:`, donorId);
    } else {
      // Create new donor
      const { data: newDonor, error: donorError } = await supabase
        .from("donors")
        .insert(donorData)
        .select()
        .single();

      if (donorError) {
        console.error(`[${requestId}] Database error creating donor:`, donorError);
        return { 
          success: false, 
          error: errorResponses.databaseError(
            "Error creating donor",
            donorError.message,
            requestId,
            timestamp
          )
        };
      }

      donorId = newDonor.id;
      console.log(`[${requestId}] Created new donor:`, donorId);

      // Create email record
      const { data: newEmail, error: emailInsertError } = await supabase
        .from("emails")
        .insert({
          email: donor.email,
          donor_id: donorId,
        })
        .select()
        .single();
        
      if (emailInsertError) {
        console.error(`[${requestId}] Database error creating email record:`, emailInsertError);
        return { 
          success: false, 
          error: errorResponses.databaseError(
            "Error creating email record",
            emailInsertError.message,
            requestId,
            timestamp
          )
        };
      }
      
      emailId = newEmail.id;
      console.log(`[${requestId}] Created email record:`, emailId);
    }

    return { success: true, donorId, emailId };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in findOrCreateDonor:`, error);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Error processing donor information",
        error.message,
        requestId,
        timestamp
      )
    };
  }
}

/**
 * Creates a new donation record in the database
 */
async function createDonation(
  supabase: ReturnType<typeof createClient>,
  donationData: any,
  donorId: string | null,
  requestId: string,
  timestamp: string
) {
  try {
    const { data: newDonation, error: donationError } = await supabase
      .from("donations")
      .insert({
        ...donationData,
        donor_id: donorId,
      })
      .select()
      .single();
      
    if (donationError) {
      console.error(`[${requestId}] Database error creating donation:`, donationError);
      return { 
        success: false, 
        error: errorResponses.databaseError(
          "Error creating donation",
          donationError.message,
          requestId,
          timestamp
        )
      };
    }
    
    const donationId = newDonation.id;
    console.log(`[${requestId}] Created donation:`, donationId, donorId ? `for donor: ${donorId}` : 'anonymous');
    
    return { success: true, donationId, donationData: newDonation };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in createDonation:`, error);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Error creating donation record",
        error.message,
        requestId,
        timestamp
      )
    };
  }
}

/**
 * Adds location information for a donor if provided
 */
async function addDonorLocation(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorId: string | null,
  requestId: string
) {
  if (!donorId || !donor || !(donor.addr1 || donor.city || donor.state)) {
    return { success: true, locationId: null };
  }

  try {
    const { data: newLocation, error: locationError } = await supabase
      .from("locations")
      .insert({
        donor_id: donorId,
        street: donor.addr1 || '',
        city: donor.city || '',
        state: donor.state || '',
        zip: donor.zip || '',
        country: donor.country || '',
        type: 'main'
      })
      .select()
      .single();
      
    if (locationError) {
      // Log error but continue - address is not critical
      console.error(`[${requestId}] Database error creating location:`, locationError);
      return { success: true, locationId: null };
    }
    
    const locationId = newLocation.id;
    console.log(`[${requestId}] Created location:`, locationId, "for donor:", donorId);
    
    return { success: true, locationId };
  } catch (error) {
    // Log error but continue - address is not critical
    console.error(`[${requestId}] Unexpected error in addDonorLocation:`, error);
    return { success: true, locationId: null };
  }
}

/**
 * Updates the webhook last_used_at timestamp
 */
async function updateWebhookTimestamp(
  supabase: ReturnType<typeof createClient>,
  timestamp: string,
  requestId: string
) {
  try {
    const { error: webhookError } = await supabase
      .from("webhooks")
      .update({ last_used_at: timestamp })
      .eq("is_active", true);
      
    if (webhookError) {
      // Non-critical error, just log it
      console.error(`[${requestId}] Error updating webhook last_used_at:`, webhookError);
    }
  } catch (webhookUpdateError) {
    // Non-critical error, just log it
    console.error(`[${requestId}] Unexpected error updating webhook timestamp:`, webhookUpdateError);
  }
}

/**
 * Creates a success response object
 */
function createSuccessResponse(
  donationId: string,
  donationData: any,
  donorId: string | null,
  donorData: any,
  donor: ActBlueDonor | undefined,
  locationId: string | null,
  requestId: string,
  timestamp: string
): WebhookSuccessResponse {
  return {
    success: true,
    message: "Donation processed successfully",
    donation: {
      id: donationId,
      ...donationData
    },
    donor: donorId ? { 
      id: donorId, 
      ...donorData,
      email: donor?.email,
      location: locationId ? {
        street: donor?.addr1,
        city: donor?.city,
        state: donor?.state,
        zip: donor?.zip,
        country: donor?.country
      } : null
    } : null,
    request_id: requestId,
    timestamp: timestamp
  };
}

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
) {
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
      
      const { donorId } = donorResult;
      
      // Create donation record
      const donationResult = await createDonation(supabase, donationData, donorId, requestId, timestamp);
      if (!donationResult.success) {
        return { success: false, error: donationResult.error };
      }
      
      const { donationId } = donationResult;
      
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
      
      const { donationId } = donationResult;
      
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
