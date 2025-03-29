
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution, ActBlueLineItem } from "../types.ts";
import { errorResponses } from "../error-handler.ts";

/**
 * Extracts donation data from the ActBlue contribution and line items
 */
export function extractDonationData(
  contribution: ActBlueContribution,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string
) {
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
  
  // Extract relevant data from the contribution
  const donationData = {
    amount: parseFloat(lineItem?.amount || contribution.amount || "0"),
    paid_at: new Date(lineItem?.paidAt || contribution.paidAt || contribution.createdAt).toISOString(),
    is_mobile: contribution.isMobile || false,
    recurring_period: contribution.recurringPeriod === 'monthly' ? 'monthly' : 
                     contribution.recurringPeriod === 'weekly' ? 'weekly' : 'once',
    recurring_duration: contribution.recurringDuration || 0,
    express_signup: contribution.expressSignup || false,
    is_express: contribution.isExpress || false,
    payment_type: contribution.isPaypal ? 'paypal' : 'credit',
    is_paypal: contribution.isPaypal || false,
  };

  return { success: true, data: donationData };
}

/**
 * Creates a new donation record in the database
 */
export async function createDonation(
  supabase: ReturnType<typeof createClient>,
  donationData: any,
  donorId: string | null,
  requestId: string,
  timestamp: string
) {
  try {
    const { data: newDonation, error: donationError } = await supabase
      .from("donations")
      .insert({
        ...donationData,
        donor_id: donorId,
      })
      .select()
      .single();
      
    if (donationError) {
      console.error(`[${requestId}] Database error creating donation:`, donationError);
      return { 
        success: false, 
        error: errorResponses.databaseError(
          "Error creating donation",
          donationError.message,
          requestId,
          timestamp
        )
      };
    }
    
    const donationId = newDonation.id;
    console.log(`[${requestId}] Created donation:`, donationId, donorId ? `for donor: ${donorId}` : 'anonymous');
    
    return { success: true, donationId, donationData: newDonation };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in createDonation:`, error);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Error creating donation record",
        error.message,
        requestId,
        timestamp
      )
    };
  }
}
