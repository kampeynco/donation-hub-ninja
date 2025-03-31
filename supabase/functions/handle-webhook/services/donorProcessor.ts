
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { 
  extractDonorData, 
  findOrCreateDonor, 
  addDonorLocation, 
  addEmployerData 
} from "../models/index.ts";

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
