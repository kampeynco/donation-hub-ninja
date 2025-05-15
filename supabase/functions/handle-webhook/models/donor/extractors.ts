
import { ActBlueDonor } from "../../types.ts";
import { DonorData } from "../types.ts";

/**
 * Extract donor data from ActBlue webhook payload
 * Maps ActBlue fields to our database schema
 */
export function extractDonorData(
  donor: ActBlueDonor | undefined,
  donation: any
): DonorData {
  // Set defaults for donor data
  const donorData: DonorData = {
    first_name: donor?.firstname || null,
    last_name: donor?.lastname || null,
    status: 'donor',
    is_express: donation?.express === true || donation?.expressSignup === true || null,
    is_mobile: donation?.mobile === true || null,
    is_paypal: (donation?.paymentMethod || '').toLowerCase().includes('paypal') || null,
    is_eligible_for_express_lane: donation?.expressLaneEligible === true || null,
  };
  
  return donorData;
}
