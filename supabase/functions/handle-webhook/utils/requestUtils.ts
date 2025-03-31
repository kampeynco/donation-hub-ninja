
import { errorResponses } from "../error-handler.ts";
import { ActBlueRequest } from "../types.ts";
import { corsHeaders } from "./corsHeaders.ts";

/**
 * Parse and validate request body
 */
export async function parseRequestBody(
  req: Request, 
  requestId: string, 
  timestamp: string
): Promise<{ success: boolean, data?: ActBlueRequest, error?: any }> {
  try {
    const body = await req.json();
    const data = body as ActBlueRequest;
    console.log(`[${requestId}] Received payload:`, JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return { success: true, data };
  } catch (error) {
    console.error(`[${requestId}] Error parsing request body:`, error);
    return { 
      success: false, 
      error: errorResponses.invalidPayload(
        "Invalid JSON payload", 
        error.message, 
        requestId, 
        timestamp
      )
    };
  }
}

/**
 * Create an HTTP response
 */
export function createResponse(
  data: any, 
  status: number
) {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}
