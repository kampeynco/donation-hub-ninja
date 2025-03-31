
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { deleteHookdeckSource } from "../utils/hookdeck-api.ts";

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

    const { sourceId, userId } = await req.json();
    
    if (!sourceId) {
      return new Response(JSON.stringify({ error: "Missing required field: sourceId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Processing delete request for Hookdeck source: ${sourceId}`);

    // Delete the Hookdeck source
    const result = await deleteHookdeckSource(sourceId);
    
    console.log("Hookdeck source deletion successful:", result);
    
    // If userId is provided, also update the webhooks table to clear the source ID
    if (userId) {
      console.log(`Updating webhook record for user: ${userId}`);
      const { error: updateError } = await supabase
        .from("webhooks")
        .update({ 
          hookdeck_source_id: null,
          actblue_webhook_url: null
        })
        .eq("user_id", userId);
        
      if (updateError) {
        console.error("Error updating webhook record:", updateError);
        // Continue anyway since the main operation (source deletion) was successful
      } else {
        console.log("Webhook record updated successfully");
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Hookdeck source deleted successfully",
      result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Hookdeck source:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
