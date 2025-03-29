
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
    // New field
    is_eligible_for_express_lane: donor?.isEligibleForExpressLane || false
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
  // Return early if any required data is missing
  if (!donorId || !donor) {
    return { success: true, locationId: null };
  }
  
  // Check if we have any valid location data to insert
  // Return early if no location data is present
  if (!donor.addr1 && !donor.city && !donor.state && !donor.zip && !donor.country) {
    console.log(`[${requestId}] No location data provided for donor ${donorId}`);
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

/**
 * Adds employer information for a donor if provided
 */
export async function addEmployerData(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorId: string | null,
  requestId: string
): Promise<{success: boolean, employerDataId: string | null}> {
  // Return early if required fields are missing
  if (!donorId || !donor) {
    return { success: true, employerDataId: null };
  }
  
  // Check if we have any employerData object at all
  if (!donor.employerData) {
    console.log(`[${requestId}] No employer data provided for donor ${donorId}`);
    return { success: true, employerDataId: null };
  }
  
  // Check if we have any valid employer data to insert
  // Even if employerData object exists, it might have empty fields
  if (!donor.employerData.employer && 
      !donor.employerData.occupation && 
      !donor.employerData.employerAddr1 && 
      !donor.employerData.employerCity && 
      !donor.employerData.employerState && 
      !donor.employerData.employerCountry) {
    console.log(`[${requestId}] Employer data object exists but contains no data for donor ${donorId}`);
    return { success: true, employerDataId: null };
  }

  try {
    console.log(`[${requestId}] Adding employer data for donor ${donorId}`);
    
    const { data: newEmployerData, error: employerError } = await supabase
      .from("employer_data")
      .insert({
        donor_id: donorId,
        employer: donor.employerData.employer || null,
        occupation: donor.employerData.occupation || null,
        employer_addr1: donor.employerData.employerAddr1 || null,
        employer_city: donor.employerData.employerCity || null,
        employer_state: donor.employerData.employerState || null,
        employer_country: donor.employerData.employerCountry || null
      })
      .select()
      .single();
      
    if (employerError) {
      // Log error but continue - employer data is not critical
      console.error(`[${requestId}] Database error creating employer data:`, employerError);
      return { success: true, employerDataId: null };
    }
    
    const employerDataId = newEmployerData.id;
    logDbOperation("Created employer data", employerDataId, requestId, `for donor: ${donorId}`);
    
    return { success: true, employerDataId: employerDataId };
  } catch (error) {
    // Log error but continue - employer data is not critical
    console.error(`[${requestId}] Unexpected error in addEmployerData:`, error);
    return { success: true, employerDataId: null };
  }
}
