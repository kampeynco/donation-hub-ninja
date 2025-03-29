
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { 
  createHookdeckConnection, 
  configureHookdeckSourceAuth 
} from "../utils/hookdeck-api.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a random password
function generateRandomPassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

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

    console.log("Processing request for user:", userId, "email:", email);

    // Generate a password for API authentication
    const apiPassword = generateRandomPassword();
    
    // Create webhook record first
    let webhookRecord;
    
    // Check if webhook exists for the user
    const { data: existingWebhook, error: fetchError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching webhook:", fetchError);
      throw new Error("Error checking webhook configuration");
    }

    // If no webhook exists yet, create one with default values
    if (!existingWebhook) {
      console.log("No webhook found, creating one for user:", userId);
      const { data, error: insertError } = await supabase
        .from("webhooks")
        .insert({
          user_id: userId,
          api_username: email,
          api_password: apiPassword,
          hookdeck_destination_url: "https://igjnhwvtasegwyiwcdkr.supabase.co/functions/v1/handle-webhook"
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating initial webhook record:", insertError);
        throw new Error("Failed to initialize webhook configuration");
      }
      
      webhookRecord = data;
      console.log("Successfully created webhook record for user:", userId);
    } else {
      webhookRecord = existingWebhook;
      // Update password if it exists
      if (!webhookRecord.api_password) {
        const { error: updateError } = await supabase
          .from("webhooks")
          .update({ api_password: apiPassword })
          .eq("id", webhookRecord.id);
          
        if (updateError) {
          console.error("Error updating webhook password:", updateError);
        } else {
          webhookRecord.api_password = apiPassword;
        }
      }
    }
    
    // Hard-coded destination ID for our webhook handler
    const donorCampDestinationId = "des_l3jgFfLpoQ8D";
    // Hard-coded transformation ID
    const transformationId = "trs_nkCMlVBaTT0MlE";
    
    // STEP 1: Create the Hookdeck connection with a new source and transformation
    const connectionResponse = await createHookdeckConnection({
      name: "donorcamp",
      userId: userId,
      destinationId: donorCampDestinationId,
      transformationId: transformationId
    });
    
    console.log("Hookdeck connection created:", connectionResponse);
    
    // Extract the source ID and URL from the response
    const sourceId = connectionResponse.source?.id;
    const sourceUrl = connectionResponse.source?.url;
    
    if (!sourceId || !sourceUrl) {
      throw new Error("Failed to get source ID or URL from Hookdeck response");
    }
    
    // STEP 2: Configure authentication for the source
    await configureHookdeckSourceAuth({
      sourceId: sourceId,
      name: userId,
      username: email,
      password: webhookRecord.api_password
    });
    
    console.log("Hookdeck source authentication configured");
    
    // Update the webhook record with Hookdeck source ID and URL
    const { error: updateError } = await supabase
      .from("webhooks")
      .update({
        hookdeck_source_id: sourceId,
        actblue_webhook_url: sourceUrl,
        last_used_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating webhook with Hookdeck IDs:", updateError);
      // Continue anyway since the webhook was created
    }

    // Return the Hookdeck source URL, which is what the user will configure in ActBlue
    return new Response(JSON.stringify({
      success: true,
      hookdeckSourceUrl: sourceUrl,
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
