
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { validateWebhookAuth } from "../auth-helper.ts";
import { errorResponses } from "../error-handler.ts";
import { corsHeaders } from "../utils/corsHeaders.ts";

/**
 * Extract user ID from request headers
 */
export function extractUserId(req: Request, requestId: string): string | null {
  const hd_user_id = req.headers.get("X-HD-Userid");
  const userId = hd_user_id || req.headers.get("source-name") || null;
  
  if (userId) {
    console.log(`[${requestId}] Request associated with user: ${userId}`);
  } else {
    console.log(`[${requestId}] No user ID found in request headers`);
  }
  
  return userId;
}

/**
 * Validate webhook request authentication
 */
export async function validateAuth(
  req: Request,
  requestId: string,
  timestamp: string,
  supabase: ReturnType<typeof createClient>
) {
  // Authenticate the request
  const authResult = await validateWebhookAuth(
    req.headers.get("Authorization"), 
    supabase, 
    requestId, 
    timestamp, 
    req.headers
  );

  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }
  
  return { success: true };
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
}

/**
 * Validate request method
 */
export function validateRequestMethod(req: Request, requestId: string, timestamp: string) {
  if (req.method !== "POST") {
    console.error(`[${requestId}] Method not allowed: ${req.method}`);
    return { 
      success: false, 
      error: errorResponses.methodNotAllowed(req.method, requestId, timestamp)
    };
  }
  return { success: true };
}
