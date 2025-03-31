
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./utils/corsHeaders.ts";
import { RequestHandler } from "./utils/requestHandler.ts";
import { verifyCredentials } from "./auth-helper.ts";
import { errorResponses } from "./error-handler.ts";
import { ActBlueRequest } from "./types.ts";
import { 
  extractContributionData, 
  extractDonorData, 
  findOrCreateDonor,
  addDonorLocation,
  addEmployerData,
  processContribution,
  handleResponse,
  createDonationNotification
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

    // Create request handler with functions to invoke
    const handler = new RequestHandler();

    // Extract and verify userId from Hookdeck headers
    const hd_user_id = req.headers.get("X-HD-Userid");
    const userId = hd_user_id || null;
    
    if (userId) {
      console.log(`[${requestId}] Request associated with user: ${userId}`);
    } else {
      console.log(`[${requestId}] No user ID found in request headers`);
    }

    // Authenticate the request
    const authResult = await handler.handleStep(
      "auth",
      async () => await verifyCredentials(req, supabaseAdmin, requestId, timestamp),
      requestId,
      timestamp
    );

    if (!authResult.success) {
      return handleResponse(authResult, requestId, timestamp);
    }
    
    // Parse request body
    const data = await handler.handleStep(
      "parse_body",
      async () => {
        const body = await req.json();
        return { success: true, data: body as ActBlueRequest };
      },
      requestId,
      timestamp
    );

    if (!data.success) {
      return handleResponse(data, requestId, timestamp);
    }

    // Extract contribution and donor data
    const contribution = data.data.contribution;
    const lineItems = data.data.lineItems || [];
    const donor = data.data.donor;
    
    if (!contribution) {
      console.error(`[${requestId}] No contribution data found in request body`);
      return handleResponse(
        { success: false, code: 400, message: "No contribution data provided" },
        requestId,
        timestamp
      );
    }

    // Process donor information
    const donorData = extractDonorData(donor);
    const donorResult = await handler.handleStep(
      "process_donor",
      async () => await findOrCreateDonor(supabaseAdmin, donor, donorData, requestId, timestamp, userId),
      requestId,
      timestamp
    );

    if (!donorResult.success) {
      return handleResponse(donorResult, requestId, timestamp);
    }

    // Only proceed with location if we have a valid donor
    if (donorResult.data?.donorId) {
      await handler.handleStep(
        "add_donor_location",
        async () => await addDonorLocation(supabaseAdmin, donor, donorResult.data.donorId!, requestId, timestamp),
        requestId,
        timestamp
      );

      await handler.handleStep(
        "add_employer_data",
        async () => await addEmployerData(supabaseAdmin, donor, donorResult.data.donorId!, requestId, timestamp),
        requestId,
        timestamp
      );
    }

    // Extract contribution data
    const { contributionData, customFields } = extractContributionData(contribution, lineItems, donorResult.data?.donorId);

    // Process donation 
    const contributionResult = await handler.handleStep(
      "process_contribution",
      async () => await processContribution(supabaseAdmin, contributionData, customFields, requestId, timestamp),
      requestId,
      timestamp
    );

    // Create notification for the donation
    await handler.handleStep(
      "create_notification",
      async () => await createDonationNotification(
        supabaseAdmin, 
        contribution, 
        donor, 
        donorResult.data?.donorId || null, 
        requestId
      ),
      requestId,
      timestamp
    );

    // Return response based on contribution processing result
    return handleResponse(contributionResult, requestId, timestamp);
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
