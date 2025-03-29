
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor } from "../../types.ts";
import { logDbOperation } from "../utils.ts";

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
