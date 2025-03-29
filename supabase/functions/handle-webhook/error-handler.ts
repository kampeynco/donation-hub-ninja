
import { WebhookErrorResponse } from "./types.ts";

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: string,
  code: number, 
  message: string, 
  details?: string,
  requestId?: string,
  timestamp?: string
): WebhookErrorResponse {
  return {
    error,
    code,
    message,
    details,
    request_id: requestId,
    timestamp: timestamp || new Date().toISOString()
  };
}

/**
 * Helper to create an HTTP response for errors
 */
export function createErrorHttpResponse(
  errorResponse: WebhookErrorResponse,
  corsHeaders: Record<string, string>,
  status: number
): Response {
  return new Response(JSON.stringify(errorResponse), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

/**
 * Standard error responses for different scenarios
 */
export const errorResponses = {
  configurationError: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("configuration_error", 503, message, details, requestId, timestamp),
    
  authenticationError: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("unauthorized", 401, message, details, requestId, timestamp),
    
  methodNotAllowed: (method: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("method_not_allowed", 405, `Only POST method is allowed, got: ${method}`, undefined, requestId, timestamp),
    
  invalidPayload: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("invalid_payload", 400, message, details, requestId, timestamp),
    
  invalidPayloadStructure: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("invalid_payload_structure", 422, message, details, requestId, timestamp),
    
  databaseError: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("database_error", 503, message, details, requestId, timestamp),
    
  serverError: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("server_error", 500, message, details, requestId, timestamp),
    
  notFoundError: (message: string, details?: string, requestId?: string, timestamp?: string) => 
    createErrorResponse("not_found", 404, message, details, requestId, timestamp)
};
