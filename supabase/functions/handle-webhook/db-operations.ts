
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueDonor, ActBlueContribution, ActBlueLineItem, WebhookSuccessResponse } from "./types.ts";
import { errorResponses } from "./error-handler.ts";

/**
 * Processes an ActBlue donation and saves it to the database
 */
export async function processDonation(
  supabase: ReturnType<typeof createClient>,
  contribution: ActBlueContribution,
  donor: ActBlueDonor | undefined,
  lineitems: ActBlueLineItem[] | undefined,
  requestId: string,
  timestamp: string
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
        requestId,
        timestamp
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

  // Extract donor information
  const donorData = {
    first_name: donor?.firstname || null,
    last_name: donor?.lastname || null,
    is_express: contribution.isExpress || false,
    is_mobile: contribution.isMobile || false,
    is_paypal: contribution.isPaypal || false,
  };

  console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
  console.log(`[${requestId}] Processed donor data:`, JSON.stringify(donorData));

  // Process the donation
  let donorId;
  let donationId;
  let emailId;
  let locationId;
  
  try {
    if (donor?.email) {
      // Try to find existing donor by email
      const { data: existingEmail, error: emailError } = await supabase
        .from("emails")
        .select("donor_id, email")
        .eq("email", donor.email)
        .maybeSingle();
      
      if (emailError) {
        console.error(`[${requestId}] Database error looking up donor email:`, emailError);
        return { 
          success: false, 
          error: errorResponses.databaseError(
            "Error looking up donor email",
            emailError.message,
            requestId,
            timestamp
          )
        };
      }

      if (existingEmail?.donor_id) {
        // Update existing donor
        donorId = existingEmail.donor_id;
        const { error: donorUpdateError } = await supabase
          .from("donors")
          .update(donorData)
          .eq("id", donorId);
        
        if (donorUpdateError) {
          console.error(`[${requestId}] Database error updating donor:`, donorUpdateError);
          return { 
            success: false, 
            error: errorResponses.databaseError(
              "Error updating donor",
              donorUpdateError.message,
              requestId,
              timestamp
            )
          };
        }
        
        console.log(`[${requestId}] Updated existing donor:`, donorId);
      } else {
        // Create new donor
        const { data: newDonor, error: donorError } = await supabase
          .from("donors")
          .insert(donorData)
          .select()
          .single();

        if (donorError) {
          console.error(`[${requestId}] Database error creating donor:`, donorError);
          return { 
            success: false, 
            error: errorResponses.databaseError(
              "Error creating donor",
              donorError.message,
              requestId,
              timestamp
            )
          };
        }

        donorId = newDonor.id;
        console.log(`[${requestId}] Created new donor:`, donorId);

        // Create email record
        const { data: newEmail, error: emailInsertError } = await supabase
          .from("emails")
          .insert({
            email: donor.email,
            donor_id: donorId,
          })
          .select()
          .single();
          
        if (emailInsertError) {
          console.error(`[${requestId}] Database error creating email record:`, emailInsertError);
          return { 
            success: false, 
            error: errorResponses.databaseError(
              "Error creating email record",
              emailInsertError.message,
              requestId,
              timestamp
            )
          };
        }
        
        emailId = newEmail.id;
        console.log(`[${requestId}] Created email record:`, emailId);
      }

      // Create donation record
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
      
      donationId = newDonation.id;
      console.log(`[${requestId}] Created donation:`, donationId, "for donor:", donorId);
        
      // Handle address if provided
      if (donor.addr1 || donor.city || donor.state) {
        const { data: newLocation, error: locationError } = await supabase
          .from("locations")
          .insert({
            donor_id: donorId,
            street: donor.addr1 || '',
            city: donor.city || '',
            state: donor.state || '',
            zip: donor.zip || '',
            country: donor.country || '',
            type: 'main'
          })
          .select()
          .single();
          
        if (locationError) {
          // Log error but continue - address is not critical
          console.error(`[${requestId}] Database error creating location:`, locationError);
        } else {
          locationId = newLocation.id;
          console.log(`[${requestId}] Created location:`, locationId, "for donor:", donorId);
        }
      }
    } else {
      console.log(`[${requestId}] Anonymous donation - no email provided`);
      // Handle anonymous donation (no email)
      const { data: anonDonation, error: anonDonationError } = await supabase
        .from("donations")
        .insert({
          ...donationData,
          donor_id: null,
        })
        .select()
        .single();
        
      if (anonDonationError) {
        console.error(`[${requestId}] Database error creating anonymous donation:`, anonDonationError);
        return { 
          success: false, 
          error: errorResponses.databaseError(
            "Error creating anonymous donation",
            anonDonationError.message,
            requestId,
            timestamp
          )
        };
      }
      
      donationId = anonDonation.id;
      console.log(`[${requestId}] Created anonymous donation:`, donationId);
    }

    // Update webhook last_used_at timestamp
    try {
      const { error: webhookError } = await supabase
        .from("webhooks")
        .update({ last_used_at: timestamp })
        .eq("is_active", true);
        
      if (webhookError) {
        // Non-critical error, just log it
        console.error(`[${requestId}] Error updating webhook last_used_at:`, webhookError);
      }
    } catch (webhookUpdateError) {
      // Non-critical error, just log it
      console.error(`[${requestId}] Unexpected error updating webhook timestamp:`, webhookUpdateError);
    }

    // Return success response
    const successResponse: WebhookSuccessResponse = {
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
    
    return { success: true, data: successResponse, error: null };
  } catch (error) {
    console.error(`[${requestId}] Unexpected database error:`, error);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Database operation failed",
        error.message,
        requestId,
        timestamp
      )
    };
  }
}
