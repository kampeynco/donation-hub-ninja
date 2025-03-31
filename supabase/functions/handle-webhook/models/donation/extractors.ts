
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
    
    if (isNaN(donationAmount) || donationAmount === null) {
      console.error(`[${requestId}] Missing or invalid donation amount in payload`);
      console.log(`[${requestId}] Contribution amount: ${contribution.amount}, LineItem amount: ${lineItem?.amount}, RecurringAmount: ${lineItem?.recurringAmount}`);
      return { 
        success: false, 
        error: errorResponses.invalidPayloadStructure(
          "Donation amount not found or invalid",
          "Amount is missing or not a valid number in both contribution and lineitem",
          requestId
        )
      };
    }
    
    // Handle "infinite" recurring duration or convert string to number
    let recurringDuration: number | null = null;
    if (contribution.recurringDuration !== undefined) {
      if (contribution.recurringDuration === "infinite" || 
          contribution.recurringDuration === Infinity ||
          contribution.recurringDuration === "Infinity") {
        // Convert "infinite" to a large integer value (e.g., 9999)
        console.log(`[${requestId}] Converting "${contribution.recurringDuration}" recurring duration to numeric value`);
        recurringDuration = 9999;
      } else if (typeof contribution.recurringDuration === 'string') {
        try {
          recurringDuration = parseInt(contribution.recurringDuration, 10);
        } catch (error) {
          console.warn(`[${requestId}] Could not parse recurringDuration: ${contribution.recurringDuration}. Setting to 0.`);
          recurringDuration = 0;
        }
      } else {
        recurringDuration = contribution.recurringDuration as number;
      }
    }
    
    // Handle boolean/string for isRecurring
    let isRecurring = false;
    if (typeof contribution.isRecurring === 'string') {
      isRecurring = contribution.isRecurring.toLowerCase() === 'true';
    } else {
      isRecurring = !!contribution.isRecurring;
    }
    
    // Determine recurring period
    let recurringPeriod: 'monthly' | 'weekly' | 'once' = 'once';
    if (isRecurring && contribution.recurringPeriod) {
      if (contribution.recurringPeriod.toLowerCase() === 'monthly') {
        recurringPeriod = 'monthly';
      } else if (contribution.recurringPeriod.toLowerCase() === 'weekly') {
        recurringPeriod = 'weekly';
      }
    }
    
    // Smart boost amount (optional)
    let smartBoostAmount: number | null = null;
    if (contribution.smartBoostAmount) {
      try {
        smartBoostAmount = parseFloat(contribution.smartBoostAmount);
      } catch (error) {
        console.warn(`[${requestId}] Could not parse smartBoostAmount: ${contribution.smartBoostAmount}`);
      }
    }
    
    // Extract relevant data from the contribution
    const donationData: DonationData = {
      amount: donationAmount,
      paid_at: new Date(lineItem?.paidAt || contribution.paidAt || contribution.createdAt).toISOString(),
      is_mobile: contribution.isMobile || false,
      recurring_period: recurringPeriod,
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
      smart_boost_amount: smartBoostAmount,
      gift_declined: contribution.giftDeclined || false,
      gift_identifier: contribution.giftIdentifier || null,
      shipping_info: contribution.shippingName ? {
        name: contribution.shippingName,
        addr1: contribution.shippingAddr1,
        city: contribution.shippingCity,
        state: contribution.shippingState,
        zip: contribution.shippingZip,
        country: contribution.shippingCountry
      } : null,
      text_message_option: contribution.textMessageOption || 'unknown',
      with_express_lane: contribution.withExpressLane || false
    };

    console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
    return { success: true, data: donationData };
  } catch (error) {
    console.error(`[${requestId}] Error extracting donation data:`, error);
    return { 
      success: false, 
      error: errorResponses.invalidPayloadStructure(
        "Error processing donation data",
        error instanceof Error ? error.message : String(error),
        requestId
      )
    };
  }
}
