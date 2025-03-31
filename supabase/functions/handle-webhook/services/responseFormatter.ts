
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
