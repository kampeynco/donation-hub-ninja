
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { errorResponses } from "./error-handler.ts";

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
  
  // No auth header provided
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return { 
      success: false, 
      error: null // Allow to proceed without authentication
    };
  }

  try {
    const encodedCredentials = authHeader.substring(6);
    const decodedCredentials = atob(encodedCredentials);
    const [username, password] = decodedCredentials.split(":");
    
    let query = supabase.from("webhooks").select("*").eq("is_active", true);
    
    // If source name is provided, use it to find the specific webhook
    if (sourceNameHeader) {
      query = query.eq("user_id", sourceNameHeader);
      console.log(`[${requestId}] Finding webhook by user_id: ${sourceNameHeader}`);
    }
    
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
      console.error(`[${requestId}] No active webhook configuration found for source: ${sourceNameHeader || 'any'}`);
      return { 
        success: false, 
        error: errorResponses.notFoundError(
          "Webhook configuration not found",
          undefined,
          requestId,
          timestamp
        )
      };
    }
    
    // Verify provided credentials against stored credentials
    if (username !== webhook.api_username || password !== webhook.api_password) {
      console.error(`[${requestId}] Authentication failed: Invalid credentials provided`);
      return { 
        success: false, 
        error: errorResponses.authenticationError(
          "Invalid authentication credentials",
          undefined,
          requestId,
          timestamp
        )
      };
    }
    
    console.log(`[${requestId}] Authentication successful for webhook: ${webhook.id}`);
    return { success: true, webhook, error: null };
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
