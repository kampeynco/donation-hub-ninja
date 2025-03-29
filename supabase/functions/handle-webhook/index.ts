
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

    // Extract Hookdeck headers
    const sourceId = req.headers.get("hookdeck-source-id");
    const hookdeckSignature = req.headers.get("hookdeck-signature");
    
    // Validate the request came from Hookdeck
    if (!sourceId || !hookdeckSignature) {
      console.error("Missing Hookdeck headers", { sourceId, hookdeckSignature });
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid Hookdeck request" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("Received webhook from Hookdeck source:", sourceId);

    // Find the webhook by Hookdeck source ID
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("hookdeck_source_id", sourceId)
      .eq("is_active", true)
      .single();

    if (webhookError || !webhook) {
      console.error("Error finding webhook for source:", sourceId, webhookError);
      return new Response(JSON.stringify({ error: "Invalid source ID or webhook not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse the request body
    const requestBody = await req.json();
    console.log("Received ActBlue webhook payload:", JSON.stringify(requestBody));

    // TODO: Process donation data and store in database
    // This would be expanded to handle ActBlue donation events

    // Update last_used_at timestamp
    await supabase
      .from("webhooks")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", webhook.id);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
