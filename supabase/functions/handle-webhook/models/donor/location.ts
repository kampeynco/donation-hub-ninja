
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor } from "../../types.ts";
import { logDbOperation } from "../utils.ts";

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
