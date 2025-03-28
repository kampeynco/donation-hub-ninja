
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

    // Fetch webhook credentials
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("id", webhookId)
      .single();

    if (webhookError || !webhook) {
      console.error("Error fetching webhook:", webhookError);
      return new Response(JSON.stringify({ error: "Error fetching webhook credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check if ActBlue webhook URL is configured
    if (!webhook.actblue_webhook_url) {
      return new Response(JSON.stringify({ error: "ActBlue webhook URL is not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create a test payload mimicking an ActBlue donation
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      contribution: {
        contributionForm: "Test Form",
        orderNumber: "TEST-" + Math.floor(Math.random() * 1000000),
        donor: {
          firstName: "Test",
          lastName: "Donor",
          email: "test@example.com",
        },
        amount: {
          amount: "10.00",
          currency: "USD"
        }
      }
    };

    // Send a test request to the ActBlue webhook URL
    const response = await fetch(webhook.actblue_webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${webhook.api_username}:${webhook.api_password}`)}`,
      },
      body: JSON.stringify(testPayload),
    });

    // Check if the request was successful (status code 200-299)
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error from ActBlue webhook:", responseText);
      return new Response(JSON.stringify({ 
        error: `ActBlue webhook returned an error: ${response.status} ${response.statusText}`,
        details: responseText
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Update the last_used_at timestamp
    const { error: updateError } = await supabase
      .from("webhooks")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", webhookId);

    if (updateError) {
      console.error("Error updating webhook last_used_at:", updateError);
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: "ActBlue webhook test completed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error testing ActBlue webhook:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
