
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { DonorData, ProcessResult } from "./types.ts";
import { logDbOperation, handleDatabaseError } from "./utils.ts";

/**
 * Extracts donor information from the ActBlue donor and contribution
 */
export function extractDonorData(
  donor: ActBlueDonor | undefined,
  contribution: ActBlueContribution
): DonorData {
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
export async function findOrCreateDonor(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorData: DonorData,
  requestId: string,
  timestamp: string
): Promise<ProcessResult<{donorId: string | null, emailId?: string}>> {
  if (!donor?.email) {
    console.log(`[${requestId}] Anonymous donation - no email provided`);
    return { success: true, data: { donorId: null } };
  }

  try {
    // Try to find existing donor by email
    const { data: existingEmail, error: emailError } = await supabase
      .from("emails")
      .select("donor_id, email")
      .eq("email", donor.email)
      .maybeSingle();
    
    if (emailError) {
      return handleDatabaseError(
        emailError, 
        "looking up", 
        "donor email", 
        requestId, 
        timestamp, 
        errorResponses.databaseError
      );
    }

    let donorId;
    let emailId;

    if (existingEmail?.donor_id) {
      // Update existing donor
      donorId = existingEmail.donor_id;
      console.log(`[${requestId}] Found existing donor with ID ${donorId}, updating donor data`);
      
      const { error: donorUpdateError } = await supabase
        .from("donors")
        .update(donorData)
        .eq("id", donorId);
      
      if (donorUpdateError) {
        return handleDatabaseError(
          donorUpdateError, 
          "updating", 
          "donor", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }
      
      logDbOperation("Updated existing donor", donorId, requestId);
    } else {
      // Create new donor
      console.log(`[${requestId}] No existing donor found for email ${donor.email}, creating new donor`);
      
      const { data: newDonor, error: donorError } = await supabase
        .from("donors")
        .insert(donorData)
        .select()
        .single();

      if (donorError) {
        return handleDatabaseError(
          donorError, 
          "creating", 
          "donor", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }

      donorId = newDonor.id;
      logDbOperation("Created new donor", donorId, requestId);

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
        return handleDatabaseError(
          emailInsertError, 
          "creating", 
          "email record", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }
      
      emailId = newEmail.id;
      logDbOperation("Created email record", emailId, requestId);
    }

    return { success: true, data: { donorId, emailId } };
  } catch (error) {
    return handleDatabaseError(
      error, 
      "processing", 
      "donor information", 
      requestId, 
      timestamp, 
      errorResponses.databaseError
    );
  }
}

/**
 * Adds location information for a donor if provided
 */
export async function addDonorLocation(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorId: string | null,
  requestId: string
): Promise<{success: boolean, locationId: string | null}> {
  if (!donorId || !donor || !(donor.addr1 || donor.city || donor.state)) {
    return { success: true, locationId: null };
  }

  try {
    console.log(`[${requestId}] Adding location data for donor ${donorId}`);
    
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
    logDbOperation("Created location", locationId, requestId, `for donor: ${donorId}`);
    
    return { success: true, locationId };
  } catch (error) {
    // Log error but continue - address is not critical
    console.error(`[${requestId}] Unexpected error in addDonorLocation:`, error);
    return { success: true, locationId: null };
  }
}
