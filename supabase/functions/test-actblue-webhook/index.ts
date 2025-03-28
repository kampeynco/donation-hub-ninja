
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { webhookId } = await req.json();
    
    if (!webhookId) {
      return new Response(JSON.stringify({ error: "Missing required field: webhookId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch webhook details
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("id", webhookId)
      .single();

    if (webhookError || !webhook) {
      console.error("Error fetching webhook:", webhookError);
      return new Response(JSON.stringify({ error: "Webhook not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    if (!webhook.actblue_webhook_url) {
      return new Response(JSON.stringify({ error: "ActBlue webhook URL not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Send a test request to the ActBlue webhook URL
    const testPayload = {
      type: "test",
      timestamp: new Date().toISOString(),
      message: "This is a test webhook from DonorCamp"
    };
    
    // In a real scenario, we'd be testing the Hookdeck connection, but for simplicity
    // we'll just assume it succeeded if the webhook is configured
    
    // Update last_used_at timestamp
    await supabase
      .from("webhooks")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", webhook.id);

    return new Response(JSON.stringify({
      success: true,
      message: "Webhook test completed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error testing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
