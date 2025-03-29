
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueWebhookPayload } from "./types.ts";
import { createErrorHttpResponse } from "./error-handler.ts";
import { errorResponses } from "./error-handler.ts";
import { validateWebhookAuth } from "./auth-helper.ts";
import { processDonation } from "./models/index.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Generate a unique request ID for tracking
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  console.log(`[${requestId}] Request received: ${req.method}`);
  console.log(`[${requestId}] Request headers:`, JSON.stringify(Object.fromEntries(req.headers.entries())));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] Responding to OPTIONS request with CORS headers`);
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] Configuration error: Missing Supabase environment variables`);
      return createErrorHttpResponse(
        errorResponses.configurationError(
          "Service unavailable due to configuration error",
          "Missing Supabase environment variables",
          requestId,
          timestamp
        ),
        corsHeaders,
        503
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authentication check (using basic auth headers when present)
    const authHeader = req.headers.get("authorization");
    const authResult = await validateWebhookAuth(authHeader, supabase, requestId, timestamp);
    
    if (!authResult.success && authResult.error) {
      return createErrorHttpResponse(authResult.error, corsHeaders, authResult.error.code);
    }
    
    // Method check - only accept POST
    if (req.method !== "POST") {
      console.error(`[${requestId}] Method not allowed: ${req.method}`);
      return createErrorHttpResponse(
        errorResponses.methodNotAllowed(req.method, requestId, timestamp),
        { ...corsHeaders, "Allow": "POST, OPTIONS" },
        405
      );
    }
    
    let payload: ActBlueWebhookPayload;
    try {
      // Parse the request body (ActBlue payload)
      payload = await req.json();
      console.log(`[${requestId}] Received ActBlue webhook payload:`, JSON.stringify(payload));
    } catch (error) {
      console.error(`[${requestId}] Error parsing payload:`, error);
      return createErrorHttpResponse(
        errorResponses.invalidPayload(
          "Invalid JSON payload",
          error.message,
          requestId,
          timestamp
        ),
        corsHeaders,
        400
      );
    }

    // Validate payload structure
    if (!payload || !payload.contribution) {
      console.error(`[${requestId}] Invalid payload structure:`, JSON.stringify(payload));
      return createErrorHttpResponse(
        errorResponses.invalidPayloadStructure(
          "Invalid ActBlue payload format",
          "Missing contribution data in payload",
          requestId,
          timestamp
        ),
        corsHeaders,
        422
      );
    }

    // Process the donation
    const processResult = await processDonation(
      supabase, 
      payload.contribution, 
      payload.donor, 
      payload.lineitems,
      requestId,
      timestamp
    );
    
    if (!processResult.success) {
      return createErrorHttpResponse(processResult.error, corsHeaders, processResult.error.code);
    }
    
    console.log(`[${requestId}] Webhook processed successfully`);
    return new Response(JSON.stringify(processResult.data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Catch any unhandled errors
    console.error(`[${requestId}] Unhandled error:`, error);
    return createErrorHttpResponse(
      errorResponses.serverError(
        "Unexpected server error",
        error.message || "Unknown error",
        requestId,
        timestamp
      ),
      corsHeaders,
      500
    );
  }
});
