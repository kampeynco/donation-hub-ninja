
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueContribution } from "../../types.ts";
import { ProcessResult } from "../types.ts";
import { logDbOperation } from "../utils.ts";

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
