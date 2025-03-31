
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleRequest } from "./utils/requestHandler.ts";

/**
 * ActBlue Webhook Handler
 * 
 * This function processes webhook payloads sent from ActBlue via Hookdeck.
 * It expects:
 * - POST requests only
 * - JSON payloads with contribution data
 * - Authorization header for authentication (when configured)
 * - source-name header from Hookdeck containing the user ID
 * 
 * Common errors:
 * - 405: Method not allowed (only POST is supported)
 * - 401: Unauthorized (when Basic Auth credentials are incorrect)
 * - 400: Invalid JSON payload
 * - 422: Missing required fields in payload
 */
serve(handleRequest);
