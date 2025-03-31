
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./utils/corsHeaders.ts";
import { testWebhook } from "./services/webhookTester.ts";

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
    
    // Test the webhook
    const result = await testWebhook(webhookId, requestId, supabase);
    
    // Return appropriate response based on test result
    return new Response(
      JSON.stringify({
        ...result,
        success: result.success
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: result.success ? 200 : (result.status || 400)
      }
    );

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
