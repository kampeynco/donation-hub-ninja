
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor } from "../../types.ts";
import { logDbOperation } from "../utils.ts";

/**
 * Adds location information for a contact if provided
 */
export async function addDonorLocation(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  contactId: string | null,
  requestId: string
): Promise<{success: boolean, locationId: string | null}> {
  // Return early if any required data is missing
  if (!contactId || !donor) {
    return { success: true, locationId: null };
  }
  
  // Check if we have any valid location data to insert
  // Return early if no location data is present
  if (!donor.addr1 && !donor.city && !donor.state && !donor.zip && !donor.country) {
    console.log(`[${requestId}] No location data provided for contact ${contactId}`);
    return { success: true, locationId: null };
  }

  try {
    console.log(`[${requestId}] Adding location data for contact ${contactId}`);
    
    const { data: newLocation, error: locationError } = await supabase
      .from("locations")
      .insert({
        contact_id: contactId,
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
    logDbOperation("Created location", locationId, requestId, `for contact: ${contactId}`);
    
    return { success: true, locationId };
  } catch (error) {
    // Log error but continue - address is not critical
    console.error(`[${requestId}] Unexpected error in addDonorLocation:`, error);
    return { success: true, locationId: null };
  }
}
