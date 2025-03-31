
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./utils/corsHeaders.ts";
import { errorResponses } from "./error-handler.ts";
import { 
  extractUserId, 
  validateAuth, 
  handleCorsPreflightRequest,
  validateRequestMethod
} from "./middleware/authMiddleware.ts";
import { 
  parseRequestBody, 
  createResponse 
} from "./utils/requestUtils.ts";
import { processActBlueWebhook } from "./controllers/webhookController.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize request tracking
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    console.log(`[${requestId}] Starting webhook request at ${timestamp}`);

    // Validate request method
    const methodValidation = validateRequestMethod(req, requestId, timestamp);
    if (!methodValidation.success) {
      return createResponse(methodValidation.error, methodValidation.error.code);
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract user ID from request headers
    const userId = extractUserId(req, requestId);

    // Authenticate the request
    const authValidation = await validateAuth(req, requestId, timestamp, supabaseAdmin);
    if (!authValidation.success) {
      return createResponse(authValidation.error, authValidation.error.code);
    }
    
    // Parse request body
    const bodyParseResult = await parseRequestBody(req, requestId, timestamp);
    if (!bodyParseResult.success) {
      return createResponse(bodyParseResult.error, bodyParseResult.error.code);
    }

    // Process the ActBlue webhook
    const webhookResult = await processActBlueWebhook(
      supabaseAdmin, 
      bodyParseResult.data!, 
      userId, 
      requestId, 
      timestamp
    );

    if (!webhookResult.success) {
      return createResponse(webhookResult.error, webhookResult.error.code);
    }

    // Return success response
    return createResponse(webhookResult.response, 200);
  } catch (error) {
    console.error("Unhandled error in webhook handler:", error);
    const errorResponse = errorResponses.serverError(
      "Internal server error", 
      error.message
    );
    return createResponse(errorResponse, 500);
  }
});
