
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { updateHookdeckSourceUrl } from "../utils/hookdeck-api.ts";

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
    const { sourceId, url } = await req.json();
    
    if (!sourceId || !url) {
      return new Response(JSON.stringify({ error: "Missing required fields: sourceId and url" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Update the Hookdeck source URL
    const result = await updateHookdeckSourceUrl(sourceId, url);

    return new Response(JSON.stringify({
      success: true,
      result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Hookdeck source URL:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
