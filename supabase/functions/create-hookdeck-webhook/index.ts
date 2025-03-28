
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { 
  createHookdeckSource, 
  createHookdeckDestination, 
  createHookdeckConnection 
} from "../utils/hookdeck-api.ts";

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
    const { userId, email } = await req.json();
    if (!userId || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: userId and email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch webhook credentials for the user
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (webhookError) {
      console.error("Error fetching webhook:", webhookError);
      return new Response(JSON.stringify({ error: "Error fetching webhook credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create a Hookdeck source for the webhook
    const sourceResponse = await createHookdeckSource({
      name: `ActBlue Webhook - ${email}`,
      url: "https://placeholder-url.com", // Will be updated later by the user
      customerId: userId
    });

    // Create a Hookdeck destination for our webhook handler
    const destinationResponse = await createHookdeckDestination({
      name: `DonorCamp API - ${email}`,
      url: webhook.hookdeck_destination_url,
      customerId: userId
    });

    // Create a connection between the source and destination
    const connectionResponse = await createHookdeckConnection({
      name: `ActBlue to DonorCamp - ${email}`,
      sourceId: sourceResponse.id,
      destinationId: destinationResponse.id,
      customerId: userId
    });

    // Update the webhook record with Hookdeck IDs
    const { error: updateError } = await supabase
      .from("webhooks")
      .update({
        hookdeck_source_id: sourceResponse.id,
        hookdeck_connection_id: connectionResponse.id,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", webhook.id);

    if (updateError) {
      console.error("Error updating webhook with Hookdeck IDs:", updateError);
      return new Response(JSON.stringify({ error: "Error updating webhook configuration" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Return the Hookdeck source URL, which is what the user will configure in ActBlue
    return new Response(JSON.stringify({
      success: true,
      hookdeckSourceUrl: sourceResponse.url,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating Hookdeck webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
