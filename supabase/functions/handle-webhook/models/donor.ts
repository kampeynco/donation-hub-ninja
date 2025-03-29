
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution } from "../types.ts";
import { errorResponses } from "../error-handler.ts";

/**
 * Extracts donor information from the ActBlue donor and contribution
 */
export function extractDonorData(
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
export async function findOrCreateDonor(
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
 * Adds location information for a donor if provided
 */
export async function addDonorLocation(
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
