
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

    // Check if webhook exists for the user
    const { data: existingWebhook, error: fetchError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching webhook:", fetchError);
      return new Response(JSON.stringify({ error: "Error checking webhook configuration" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // If no webhook exists yet, create one with default values
    if (!existingWebhook) {
      console.log("No webhook found, creating one for user:", userId);
      const { error: insertError } = await supabase
        .from("webhooks")
        .insert({
          user_id: userId,
          api_username: email,
          api_password: generateRandomPassword(),
          hookdeck_destination_url: "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook"
        });

      if (insertError) {
        console.error("Error creating initial webhook record:", insertError);
        return new Response(JSON.stringify({ error: "Failed to initialize webhook configuration" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      // Fetch the newly created webhook
      const { data: webhook, error: refetchError } = await supabase
        .from("webhooks")
        .select("*")
        .eq("user_id", userId)
        .single();
        
      if (refetchError) {
        console.error("Error fetching new webhook:", refetchError);
        return new Response(JSON.stringify({ error: "Error with webhook initialization" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      // Use the newly created webhook for the Hookdeck setup
      console.log("Successfully created webhook record for user:", userId);
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
      url: "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook",
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
      .eq("user_id", userId);

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

// Helper function to generate a random password
function generateRandomPassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
