
import { ActBlueDonor } from "../types.ts";
import { SuccessResponseData } from "./types.ts";

/**
 * Creates a success response object
 */
export function createSuccessResponse(
  donationId: string,
  donationData: any,
  donorId: string | null,
  donorData: any,
  donor: ActBlueDonor | undefined,
  locationId: string | null,
  requestId: string,
  timestamp: string
): SuccessResponseData {
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
