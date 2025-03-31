
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { errorResponses } from "../error-handler.ts";

/**
 * Validates webhook authentication using provided credentials
 * @returns Object with success flag and error response or webhook data
 */
export async function validateWebhookAuth(
  authHeader: string | null,
  supabase: ReturnType<typeof createClient>,
  requestId: string,
  timestamp: string,
  headers: Headers
) {
  // Extract the Hookdeck source name from headers (contains the user ID)
  const sourceNameHeader = headers.get("source-name");
  console.log(`[${requestId}] Extracted source name header: ${sourceNameHeader}`);
  
  // If no auth header is provided, log but allow to proceed for testing
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    console.log(`[${requestId}] No authentication header provided or invalid format: ${authHeader}`);
    
    // Only allow this in development/testing environments
    if (Deno.env.get("ENVIRONMENT") === "development") {
      console.log(`[${requestId}] DEVELOPMENT MODE: Allowing request without authentication`);
      return { 
        success: true, 
        error: null 
      };
    } else {
      console.error(`[${requestId}] Authentication required: No valid Basic Auth header provided`);
      return { 
        success: false, 
        error: errorResponses.authenticationError(
          "Authentication required",
          "Missing or invalid Basic Auth header format",
          requestId,
          timestamp
        )
      };
    }
  }

  return await verifyCredentials(authHeader, supabase, sourceNameHeader, requestId, timestamp);
}

/**
 * Verifies the provided credentials against stored webhook configurations
 */
async function verifyCredentials(
  authHeader: string,
  supabase: ReturnType<typeof createClient>,
  sourceNameHeader: string | null,
  requestId: string,
  timestamp: string
) {
  try {
    const encodedCredentials = authHeader.substring(6);
    const decodedCredentials = atob(encodedCredentials);
    const [username, password] = decodedCredentials.split(":");
    
    console.log(`[${requestId}] Attempting to authenticate with username: ${username}`);
    
    // Debug logging - query for all webhooks to see what's available
    const { data: allWebhooks, error: webhooksError } = await supabase
      .from("webhooks")
      .select("id, user_id, api_username, is_active")
      .eq("is_active", true);
      
    if (webhooksError) {
      console.error(`[${requestId}] Error fetching all webhooks:`, webhooksError);
    } else {
      console.log(`[${requestId}] Available active webhooks:`, 
        JSON.stringify(allWebhooks.map(w => ({id: w.id, user_id: w.user_id, username: w.api_username}))));
    }
    
    const webhook = await findWebhook(supabase, sourceNameHeader, username, requestId);
    
    if (!webhook.success) {
      return webhook;
    }
    
    // Verify provided credentials against stored credentials
    if (username !== webhook.data.api_username || password !== webhook.data.api_password) {
      console.error(`[${requestId}] Authentication failed: Invalid credentials provided. Expected username: ${webhook.data.api_username}`);
      if (username === webhook.data.api_username) {
        console.error(`[${requestId}] Username matched but password was incorrect`);
        // Log first 3 chars of provided and expected passwords for debugging
        console.error(`[${requestId}] Password mismatch. Provided starts with: ${password.substring(0, 3)}..., Expected starts with: ${webhook.data.api_password.substring(0, 3)}...`);
      }
      return { 
        success: false, 
        error: errorResponses.authenticationError(
          "Invalid authentication credentials",
          "The provided username or password is incorrect",
          requestId,
          timestamp
        )
      };
    }
    
    console.log(`[${requestId}] Authentication successful for webhook: ${webhook.data.id}`);
    return { success: true, webhook: webhook.data, error: null };
  } catch (error) {
    console.error(`[${requestId}] Error during authentication:`, error);
    return { 
      success: false, 
      error: errorResponses.serverError(
        "Error processing authentication", 
        error.message,
        requestId,
        timestamp
      )
    };
  }
}

/**
 * Finds the webhook configuration in the database
 */
async function findWebhook(
  supabase: ReturnType<typeof createClient>,
  sourceNameHeader: string | null,
  username: string,
  requestId: string
) {
  let query = supabase.from("webhooks").select("*").eq("is_active", true);
  
  // If source name is provided, use it to find the specific webhook
  if (sourceNameHeader) {
    query = query.eq("user_id", sourceNameHeader);
    console.log(`[${requestId}] Finding webhook by user_id: ${sourceNameHeader}`);
  }
  
  // Try to find by username as a fallback
  query = query.eq("api_username", username);
  console.log(`[${requestId}] Also filtering by username: ${username}`);
  
  // Fetch webhook from database to verify credentials
  const { data: webhook, error: webhookError } = await query.maybeSingle();
  
  if (webhookError) {
    console.error(`[${requestId}] Database error while fetching webhook:`, webhookError);
    return { 
      success: false, 
      error: errorResponses.databaseError(
        "Error accessing webhook configuration", 
        webhookError.message,
        requestId,
        timestamp
      )
    };
  }
  
  if (!webhook) {
    console.error(`[${requestId}] No active webhook configuration found for source: ${sourceNameHeader || 'any'} and username: ${username}`);
    return { 
      success: false, 
      error: errorResponses.notFoundError(
        "Webhook configuration not found",
        `No active webhook configuration exists for the provided credentials (username: ${username})`,
        requestId,
        timestamp
      )
    };
  }
  
  return { success: true, data: webhook };
}
