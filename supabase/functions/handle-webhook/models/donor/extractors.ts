
import { ActBlueDonor, ActBlueContribution } from "../../types.ts";
import { DonorData } from "../types.ts";

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
