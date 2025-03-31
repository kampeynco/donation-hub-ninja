
import { ActBlueContribution, ActBlueLineItem } from "../../types.ts";
import { errorResponses } from "../../error-handler.ts";
import { DonationData, ProcessResult } from "../types.ts";

/**
 * Extracts donation data from the ActBlue contribution and line items
 */
export function extractDonationData(
  contribution: ActBlueContribution,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string
): ProcessResult<DonationData> {
  try {
    // Get the first line item for the amount if not in contribution
    const lineItem = lineitems && lineitems.length > 0 ? lineitems[0] : null;
    
    let donationAmount: number | null = null;
    
    // Try to get amount from different possible sources
    if (contribution.amount) {
      donationAmount = parseFloat(contribution.amount);
    } else if (lineItem && lineItem.amount) {
      donationAmount = parseFloat(lineItem.amount);
    } else if (lineItem && lineItem.recurringAmount) {
      donationAmount = parseFloat(lineItem.recurringAmount);
    }
    
    if (!donationAmount && donationAmount !== 0) {
      console.error(`[${requestId}] Missing donation amount in payload`);
      return { 
        success: false, 
        error: errorResponses.invalidPayloadStructure(
          "Donation amount not found",
          "Neither contribution.amount nor lineitem.amount is present",
          requestId
        )
      };
    }
    
    // Handle "infinite" recurring duration
    let recurringDuration = contribution.recurringDuration;
    if (recurringDuration === "infinite" || recurringDuration === Infinity) {
      // Convert "infinite" to a large integer value (e.g., 9999)
      console.log(`[${requestId}] Converting "infinite" recurring duration to numeric value`);
      recurringDuration = 9999;
    }
    
    // Extract relevant data from the contribution
    const donationData: DonationData = {
      amount: donationAmount,
      paid_at: new Date(lineItem?.paidAt || contribution.paidAt || contribution.createdAt).toISOString(),
      is_mobile: contribution.isMobile || false,
      recurring_period: contribution.recurringPeriod === 'monthly' ? 'monthly' : 
                      contribution.recurringPeriod === 'weekly' ? 'weekly' : 'once',
      recurring_duration: recurringDuration || 0,
      express_signup: contribution.expressSignup || false,
      is_express: contribution.isExpress || false,
      is_paypal: contribution.isPaypal || false,
      // New fields
      order_number: contribution.orderNumber,
      contribution_form: contribution.contributionForm,
      status: contribution.status,
      refcodes: contribution.refcodes || {},
      lineitem_id: lineItem?.lineitemId,
      entity_id: lineItem?.entityId,
      committee_name: lineItem?.committeeName,
      smart_boost_amount: contribution.smartBoostAmount ? parseFloat(contribution.smartBoostAmount) : null,
      gift_declined: contribution.giftDeclined || false,
      gift_identifier: contribution.giftIdentifier || null,
      shipping_info: contribution.shippingName ? {
        name: contribution.shippingName,
        addr1: contribution.shippingAddr1,
        city: contribution.shippingCity,
        state: contribution.shippingState,
        zip: contribution.shippingZip,
        country: contribution.shippingCountry
      } : null
    };

    console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
    return { success: true, data: donationData };
  } catch (error) {
    console.error(`[${requestId}] Error extracting donation data:`, error);
    return { 
      success: false, 
      error: errorResponses.invalidPayloadStructure(
        "Error processing donation data",
        error.message,
        requestId
      )
    };
  }
}
