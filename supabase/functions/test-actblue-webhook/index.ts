
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] Test webhook request received`);
    
    // Parse request body
    const { webhookId } = await req.json();
    
    if (!webhookId) {
      console.error(`[${requestId}] Missing webhookId in request`);
      return new Response(
        JSON.stringify({ 
          error: 'Missing webhookId in request',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    console.log(`[${requestId}] Testing webhook with ID: ${webhookId}`);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] Missing Supabase environment variables`);
      return new Response(
        JSON.stringify({ 
          error: 'Missing Supabase environment variables',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get webhook details
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .single();
      
    if (webhookError || !webhook) {
      console.error(`[${requestId}] Error fetching webhook:`, webhookError);
      return new Response(
        JSON.stringify({ 
          error: webhookError?.message || 'Webhook not found', 
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      );
    }
    
    // Create test payload
    const testPayload = {
      donor: {
        firstname: "Test",
        lastname: "Donor",
        addr1: "123 Test St",
        city: "Test City",
        state: "CA",
        zip: "12345",
        country: "United States",
        email: "test@example.com",
        phone: "(555) 555-5555",
        isEligibleForExpressLane: false,
        employerData: {
          employer: "Test Employer",
          occupation: "Tester",
        }
      },
      contribution: {
        createdAt: new Date().toISOString(),
        orderNumber: `TEST-${Date.now()}`,
        contributionForm: "Test Form",
        refcodes: {},
        recurringPeriod: "weekly", // Set to weekly to test weekly recurring donations
        recurringDuration: 12,     // Set valid duration to ensure it's recognized as recurring
        isRecurring: true,         // Keep this for backward compatibility, but not used
        isPaypal: false,
        isMobile: false,
        isExpress: false,
        withExpressLane: false,
        expressSignup: false,
        status: "approved",
        amount: "10.00",
        paidAt: new Date().toISOString()
      },
      lineitems: [
        {
          sequence: 0,
          entityId: 12345,
          fecId: "TEST123",
          committeeName: webhook.committee_name || "Test Committee",
          amount: "10.00",
          recurringAmount: null,
          paidAt: new Date().toISOString(),
          paymentId: Date.now(),
          lineitemId: Date.now() + 1
        }
      ]
    };
    
    // Get the Hookdeck destination URL (edge function URL)
    const destinationUrl = webhook.hookdeck_destination_url || "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook";
    
    console.log(`[${requestId}] Sending test request to: ${destinationUrl}`);
    console.log(`[${requestId}] Using auth credentials: ${webhook.api_username}:${webhook.api_password.substring(0, 3)}***`);
    
    // Create authorization header
    const authHeaderValue = `Basic ${btoa(`${webhook.api_username}:${webhook.api_password}`)}`;
    
    // Log full auth header for debugging
    const debugAuthHeader = `Basic ${btoa(`${webhook.api_username}:[redacted]`)}`;
    console.log(`[${requestId}] Auth header format: ${debugAuthHeader}`);
    
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
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Webhook test successful',
            status: response.status,
            data: responseData
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 200 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Webhook test failed',
            status: response.status,
            error: responseData
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          }
        );
      }
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Webhook test received non-JSON response',
          status: response.status,
          responseText: responseText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
  } catch (error) {
    console.error(`Error in test-actblue-webhook:`, error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
