
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
