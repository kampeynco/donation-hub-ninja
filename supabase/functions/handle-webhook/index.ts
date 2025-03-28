
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

    // Handle authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Extract and decode basic auth credentials
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(":");

    // Validate credentials against the webhook table
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("id, user_id")
      .eq("api_username", username)
      .eq("api_password", password)
      .eq("is_active", true)
      .single();

    if (webhookError || !webhook) {
      console.error("Authentication failed:", webhookError);
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse the request body
    const requestBody = await req.json();
    console.log("Received webhook payload:", JSON.stringify(requestBody));

    // Store the webhook event
    const { data: eventData, error: eventError } = await supabase
      .from("webhook_events")
      .insert({
        webhook_id: webhook.id,
        event_type: requestBody.type || "unknown",
        payload: requestBody,
        processed: false,
      });

    if (eventError) {
      console.error("Error storing webhook event:", eventError);
      return new Response(JSON.stringify({ error: "Error processing webhook" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

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
