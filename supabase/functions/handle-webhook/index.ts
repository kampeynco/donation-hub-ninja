
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./utils/corsHeaders.ts";
import { validateWebhookAuth } from "./auth-helper.ts";
import { errorResponses } from "./error-handler.ts";
import { ActBlueRequest } from "./types.ts";
import { 
  extractDonationData, 
  extractDonorData, 
  findOrCreateDonor,
  addDonorLocation,
  addEmployerData,
  createDonation,
  createDonationNotification,
  processCustomFields,
  processMerchandise,
  updateWebhookTimestamp
} from "./models/index.ts";

serve(async (req) => {
  // Preflight request handling
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    console.log(`[${requestId}] Starting webhook request at ${timestamp}`);

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract and verify userId from Hookdeck headers
    const hd_user_id = req.headers.get("X-HD-Userid");
    const userId = hd_user_id || req.headers.get("source-name") || null;
    
    if (userId) {
      console.log(`[${requestId}] Request associated with user: ${userId}`);
    } else {
      console.log(`[${requestId}] No user ID found in request headers`);
    }

    // Authenticate the request
    const authResult = await validateWebhookAuth(req.headers.get("Authorization"), supabaseAdmin, requestId, timestamp, req.headers);

    if (!authResult.success) {
      return new Response(JSON.stringify(authResult.error), {
        status: authResult.error.code,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Parse request body
    let data;
    try {
      const body = await req.json();
      data = body as ActBlueRequest;
    } catch (error) {
      console.error(`[${requestId}] Error parsing request body:`, error);
      return new Response(
        JSON.stringify(errorResponses.invalidPayload(
          "Invalid JSON payload", 
          error.message, 
          requestId, 
          timestamp
        )),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Extract donation and donor data
    const donation = data.contribution;
    const lineItems = data.lineItems || [];
    const donor = data.donor;
    
    if (!donation) {
      console.error(`[${requestId}] No donation data found in request body`);
      return new Response(
        JSON.stringify(errorResponses.invalidPayloadStructure(
          "No donation data provided", 
          "Missing contribution data", 
          requestId, 
          timestamp
        )),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Process donor information
    const donorData = extractDonorData(donor, donation);
    const donorResult = await findOrCreateDonor(supabaseAdmin, donor, donorData, requestId, timestamp, userId);

    if (!donorResult.success) {
      return new Response(
        JSON.stringify(donorResult.error),
        { 
          status: donorResult.error.code, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Only proceed with location if we have a valid donor
    let locationId = null;
    let employerDataId = null;

    if (donorResult.data?.donorId) {
      const locationResult = await addDonorLocation(
        supabaseAdmin, 
        donor, 
        donorResult.data.donorId, 
        requestId, 
        timestamp
      );
      
      if (locationResult.success && locationResult.data) {
        locationId = locationResult.data.locationId;
      }

      const employerResult = await addEmployerData(
        supabaseAdmin, 
        donor, 
        donorResult.data.donorId, 
        requestId, 
        timestamp
      );
      
      if (employerResult.success && employerResult.data) {
        employerDataId = employerResult.data.employerDataId;
      }
    }

    // Extract donation data
    const donationDataResult = extractDonationData(donation, lineItems, requestId);
    
    if (!donationDataResult.success) {
      return new Response(
        JSON.stringify(donationDataResult.error),
        { 
          status: donationDataResult.error.code, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Process donation 
    const donationResult = await createDonation(
      supabaseAdmin, 
      donationDataResult.data, 
      donorResult.data?.donorId || null, 
      requestId, 
      timestamp
    );

    if (!donationResult.success) {
      return new Response(
        JSON.stringify(donationResult.error),
        { 
          status: donationResult.error.code, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Process custom fields if any
    if (donation.customFields && donation.customFields.length > 0) {
      await processCustomFields(
        supabaseAdmin,
        donation,
        donationResult.data.donationId,
        requestId
      );
    }

    // Process merchandise if any
    if (donation.merchandise && donation.merchandise.length > 0) {
      await processMerchandise(
        supabaseAdmin,
        donation,
        donationResult.data.donationId,
        requestId
      );
    }

    // Create notification for the donation
    await createDonationNotification(
      supabaseAdmin, 
      donation, 
      donor, 
      donorResult.data?.donorId || null, 
      requestId
    );

    // Update webhook last_used_at timestamp
    await updateWebhookTimestamp(supabaseAdmin, timestamp, requestId);

    // Return success response
    const successResponse = {
      success: true,
      message: "Donation processed successfully",
      donation: {
        id: donationResult.data.donationId,
        ...donationResult.data.donationData
      },
      donor: donorResult.data?.donorId ? { 
        id: donorResult.data.donorId, 
        ...donorResult.data.donorData,
        email: donor?.email,
        location: locationId ? {
          street: donor?.addr1,
          city: donor?.city,
          state: donor?.state,
          zip: donor?.zip,
          country: donor?.country
        } : null,
        employer_data: employerDataId && donor?.employerData ? {
          employer: donor.employerData.employer,
          occupation: donor.employerData.occupation
        } : null
      } : null,
      request_id: requestId,
      timestamp: timestamp
    };

    console.log(`[${requestId}] Webhook processed successfully`);
    return new Response(
      JSON.stringify(successResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unhandled error in webhook handler:", error);
    return new Response(
      JSON.stringify(errorResponses.serverError),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
