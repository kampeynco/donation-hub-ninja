
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "../utils/corsHeaders.ts";
import { generateTestPayload } from "./testPayloadGenerator.ts";

/**
 * Sends a test webhook request
 */
export async function testWebhook(
  webhookId: string, 
  requestId: string,
  supabase: ReturnType<typeof createClient>
) {
  console.log(`[${requestId}] Testing webhook with ID: ${webhookId}`);
  
  // Get webhook details
  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', webhookId)
    .single();
    
  if (webhookError || !webhook) {
    console.error(`[${requestId}] Error fetching webhook:`, webhookError);
    return {
      success: false,
      error: webhookError?.message || 'Webhook not found',
      status: 404
    };
  }
  
  // Create test payload
  const testPayload = generateTestPayload(webhook.committee_name || "Test Committee");
  
  // Get the Hookdeck destination URL (edge function URL)
  const destinationUrl = webhook.hookdeck_destination_url || "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook";
  
  console.log(`[${requestId}] Sending test request to: ${destinationUrl}`);
  console.log(`[${requestId}] Using auth credentials: ${webhook.api_username}:${webhook.api_password.substring(0, 3)}***`);
  
  // Create authorization header
  const authHeaderValue = `Basic ${btoa(`${webhook.api_username}:${webhook.api_password}`)}`;
  
  // Log full auth header for debugging
  const debugAuthHeader = `Basic ${btoa(`${webhook.api_username}:[redacted]`)}`;
  console.log(`[${requestId}] Auth header format: ${debugAuthHeader}`);
  
  try {
    // Send test request directly to the edge function
    const response = await fetch(destinationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeaderValue,
        'Source-Name': webhook.user_id
      },
      body: JSON.stringify(testPayload)
    });
    
    const responseText = await response.text();
    console.log(`[${requestId}] Webhook test response (${response.status}): ${responseText}`);
    
    try {
      const responseData = JSON.parse(responseText);
      
      if (response.ok) {
        return {
          success: true, 
          message: 'Webhook test successful',
          status: response.status,
          data: responseData
        };
      } else {
        return {
          success: false, 
          message: 'Webhook test failed',
          status: response.status,
          error: responseData
        };
      }
    } catch (e) {
      return {
        success: false, 
        message: 'Webhook test received non-JSON response',
        status: response.status,
        responseText: responseText
      };
    }
  } catch (error) {
    console.error(`[${requestId}] Error sending test webhook:`, error);
    return {
      success: false,
      error: error.message,
      status: 500
    };
  }
}
