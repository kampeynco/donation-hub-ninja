
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution, ActBlueLineItem } from "../types.ts";
import { errorResponses } from "../error-handler.ts";
import { DonationData, ProcessResult } from "./types.ts";
import { logDbOperation, handleDatabaseError } from "./utils.ts";

/**
 * Extracts donation data from the ActBlue contribution and line items
 */
export function extractDonationData(
  contribution: ActBlueContribution,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string
): ProcessResult<DonationData> {
  // Get the first line item for the amount if not in contribution
  const lineItem = lineitems && lineitems.length > 0 ? lineitems[0] : null;
  
  if (!lineItem && !contribution.amount) {
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
    amount: parseFloat(lineItem?.amount || contribution.amount || "0"),
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

  return { success: true, data: donationData };
}

/**
 * Creates a new donation record in the database
 */
export async function createDonation(
  supabase: ReturnType<typeof createClient>,
  donationData: DonationData,
  donorId: string | null,
  requestId: string,
  timestamp: string
): Promise<ProcessResult<{donationId: string, donationData: any}>> {
  try {
    console.log(`[${requestId}] Attempting to insert donation with data:`, JSON.stringify(donationData));
    
    const { data: newDonation, error: donationError } = await supabase
      .from("donations")
      .insert({
        ...donationData,
        donor_id: donorId,
      })
      .select()
      .single();
      
    if (donationError) {
      return handleDatabaseError(
        donationError, 
        "creating", 
        "donation", 
        requestId, 
        timestamp, 
        errorResponses.databaseError
      );
    }
    
    const donationId = newDonation.id;
    logDbOperation("Created donation", donationId, requestId, donorId ? `for donor: ${donorId}` : 'anonymous');
    
    return { success: true, data: { donationId, donationData: newDonation } };
  } catch (error) {
    return handleDatabaseError(
      error, 
      "creating", 
      "donation record", 
      requestId, 
      timestamp, 
      errorResponses.databaseError
    );
  }
}

/**
 * Processes custom fields from contribution
 */
export async function processCustomFields(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donationId: string,
  requestId: string
): Promise<ProcessResult<void>> {
  if (!contribution.customFields || contribution.customFields.length === 0) {
    return { success: true };
  }

  try {
    console.log(`[${requestId}] Processing ${contribution.customFields.length} custom fields for donation: ${donationId}`);
    
    const customFieldsData = contribution.customFields.map(field => ({
      donation_id: donationId,
      label: field.label,
      answer: field.answer
    }));
    
    const { error } = await supabase
      .from("custom_fields")
      .insert(customFieldsData);
      
    if (error) {
      console.error(`[${requestId}] Error saving custom fields:`, error);
      // Non-critical error, continue processing
      return { success: true };
    }
    
    logDbOperation("Added custom fields", donationId, requestId, `count: ${customFieldsData.length}`);
    return { success: true };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error processing custom fields:`, error);
    // Non-critical error, continue processing
    return { success: true };
  }
}

/**
 * Processes merchandise items from contribution
 */
export async function processMerchandise(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donationId: string,
  requestId: string
): Promise<ProcessResult<void>> {
  if (!contribution.merchandise || contribution.merchandise.length === 0) {
    return { success: true };
  }

  try {
    console.log(`[${requestId}] Processing ${contribution.merchandise.length} merchandise items for donation: ${donationId}`);
    
    const merchandiseData = contribution.merchandise.map(item => ({
      donation_id: donationId,
      name: item.name,
      item_id: item.itemId,
      details: item.details
    }));
    
    const { error } = await supabase
      .from("merchandise")
      .insert(merchandiseData);
      
    if (error) {
      console.error(`[${requestId}] Error saving merchandise:`, error);
      // Non-critical error, continue processing
      return { success: true };
    }
    
    logDbOperation("Added merchandise", donationId, requestId, `count: ${merchandiseData.length}`);
    return { success: true };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error processing merchandise:`, error);
    // Non-critical error, continue processing
    return { success: true };
  }
}
