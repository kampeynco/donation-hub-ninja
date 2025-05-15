
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor } from "../../types.ts";
import { errorResponses } from "../../error-handler.ts";
import { DonorData, ProcessResult } from "../types.ts";
import { logDbOperation, handleDatabaseError } from "../utils.ts";

/**
 * Finds or creates a donor by email in the database
 */
export async function findOrCreateDonor(
  supabase: ReturnType<typeof createClient>,
  donor: ActBlueDonor | undefined,
  donorData: DonorData,
  requestId: string,
  timestamp: string,
  userId?: string
): Promise<ProcessResult<{donorId: string | null, emailId?: string}>> {
  if (!donor?.email) {
    console.log(`[${requestId}] Anonymous donation - no email provided`);
    return { success: true, data: { donorId: null } };
  }

  try {
    // Try to find existing donor by email
    const { data: existingEmail, error: emailError } = await supabase
      .from("emails")
      .select("contact_id, email")
      .eq("email", donor.email)
      .maybeSingle();
    
    if (emailError) {
      return handleDatabaseError(
        emailError, 
        "looking up", 
        "donor email", 
        requestId, 
        timestamp, 
        errorResponses.databaseError
      );
    }

    let donorId;
    let emailId;

    if (existingEmail?.contact_id) {
      // Update existing donor
      donorId = existingEmail.contact_id;
      console.log(`[${requestId}] Found existing donor with ID ${donorId}, updating donor data`);
      
      const { error: donorUpdateError } = await supabase
        .from("contacts")
        .update(donorData)
        .eq("id", donorId);
      
      if (donorUpdateError) {
        return handleDatabaseError(
          donorUpdateError, 
          "updating", 
          "donor", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }
      
      logDbOperation("Updated existing donor", donorId, requestId);
    } else {
      // Create new donor
      console.log(`[${requestId}] No existing donor found for email ${donor.email}, creating new donor`);
      
      const { data: newDonor, error: donorError } = await supabase
        .from("contacts")
        .insert(donorData)
        .select()
        .single();

      if (donorError) {
        return handleDatabaseError(
          donorError, 
          "creating", 
          "donor", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }

      donorId = newDonor.id;
      logDbOperation("Created new donor", donorId, requestId);

      // Create email record
      const { data: newEmail, error: emailInsertError } = await supabase
        .from("emails")
        .insert({
          email: donor.email,
          contact_id: donorId,
        })
        .select()
        .single();
        
      if (emailInsertError) {
        return handleDatabaseError(
          emailInsertError, 
          "creating", 
          "email record", 
          requestId, 
          timestamp, 
          errorResponses.databaseError
        );
      }
      
      emailId = newEmail.id;
      logDbOperation("Created email record", emailId, requestId);
    }
    
    // Add entry to user_contacts junction table if userId is provided
    // This is the case when the webhook is called with a user ID from Hookdeck
    if (userId && donorId) {
      // Check if association already exists
      const { data: existingAssociation, error: checkAssociationError } = await supabase
        .from("user_contacts")
        .select("id")
        .eq("user_id", userId)
        .eq("contact_id", donorId)
        .maybeSingle();
        
      if (checkAssociationError) {
        console.error(`[${requestId}] Error checking user-donor association:`, checkAssociationError);
        // Non-critical error, continue processing
      }
      
      // Only create a new association if one doesn't exist
      if (!existingAssociation) {
        const { error: associationError } = await supabase
          .from("user_contacts")
          .insert({
            user_id: userId,
            contact_id: donorId
          });
          
        if (associationError) {
          console.error(`[${requestId}] Error creating user-donor association:`, associationError);
          // Non-critical error, continue processing
        } else {
          logDbOperation("Created user-donor association", donorId, requestId, `for user: ${userId}`);
        }
      } else {
        console.log(`[${requestId}] User-donor association already exists for user ${userId} and donor ${donorId}`);
      }
    }

    return { success: true, data: { donorId, emailId } };
  } catch (error) {
    return handleDatabaseError(
      error, 
      "processing", 
      "donor information", 
      requestId, 
      timestamp, 
      errorResponses.databaseError
    );
  }
}
