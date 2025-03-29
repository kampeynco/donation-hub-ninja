
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueWebhookPayload } from "./types.ts";

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

    console.log("Request method:", req.method);
    console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    let payload: ActBlueWebhookPayload;
    try {
      // Parse the request body (ActBlue payload)
      payload = await req.json();
      console.log("Received ActBlue webhook payload:", JSON.stringify(payload));
    } catch (error) {
      console.error("Error parsing payload:", error);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Process ActBlue payload
    if (!payload || !payload.contribution) {
      console.error("Invalid payload structure:", JSON.stringify(payload));
      throw new Error("Invalid ActBlue payload format - missing contribution data");
    }

    const { contribution, donor, lineitems } = payload;
    
    // Get the first line item for the amount if not in contribution
    const lineItem = lineitems && lineitems.length > 0 ? lineitems[0] : null;
    
    // Extract relevant data from the contribution
    const donationData = {
      amount: parseFloat(lineItem?.amount || "0"),
      paid_at: new Date(lineItem?.paidAt || contribution.createdAt).toISOString(),
      is_mobile: contribution.isMobile || false,
      recurring_period: contribution.recurringPeriod === 'monthly' ? 'monthly' : 
                       contribution.recurringPeriod === 'weekly' ? 'weekly' : 'once',
      recurring_duration: contribution.recurringDuration || 0,
      express_signup: contribution.expressSignup || false,
      is_express: contribution.isExpress || false,
      payment_type: contribution.isPaypal ? 'paypal' : 'credit',
    };

    // Extract donor information
    const donorData = {
      first_name: donor?.firstname || null,
      last_name: donor?.lastname || null,
      is_express: contribution.isExpress || false,
      is_mobile: contribution.isMobile || false,
      is_paypal: contribution.isPaypal || false,
    };

    console.log("Processed donation data:", JSON.stringify(donationData));
    console.log("Processed donor data:", JSON.stringify(donorData));

    // Create or update donor
    let donorId;
    if (donor?.email) {
      // Try to find existing donor by email
      const { data: existingEmail, error: emailError } = await supabase
        .from("emails")
        .select("donor_id, email")
        .eq("email", donor.email)
        .maybeSingle();
      
      if (emailError) {
        console.error("Error looking up donor email:", emailError);
      }

      if (existingEmail?.donor_id) {
        // Update existing donor
        donorId = existingEmail.donor_id;
        await supabase
          .from("donors")
          .update(donorData)
          .eq("id", donorId);
        
        console.log("Updated existing donor:", donorId);
      } else {
        // Create new donor
        const { data: newDonor, error: donorError } = await supabase
          .from("donors")
          .insert(donorData)
          .select()
          .single();

        if (donorError) {
          console.error("Error creating donor:", donorError);
          throw donorError;
        }

        donorId = newDonor.id;
        console.log("Created new donor:", donorId);

        // Create email record
        const { error: emailInsertError } = await supabase
          .from("emails")
          .insert({
            email: donor.email,
            donor_id: donorId,
          });
          
        if (emailInsertError) {
          console.error("Error creating email record:", emailInsertError);
        }
      }

      // Create donation record
      const { error: donationError } = await supabase
        .from("donations")
        .insert({
          ...donationData,
          donor_id: donorId,
        });
        
      if (donationError) {
        console.error("Error creating donation:", donationError);
      } else {
        console.log("Created donation for donor:", donorId);
      }
        
      // Handle address if provided
      if (donor.addr1 || donor.city || donor.state) {
        const { error: locationError } = await supabase
          .from("locations")
          .insert({
            donor_id: donorId,
            street: donor.addr1 || '',
            city: donor.city || '',
            state: donor.state || '',
            zip: donor.zip || '',
            country: donor.country || '',
            type: 'main'
          });
          
        if (locationError) {
          console.error("Error creating location:", locationError);
        } else {
          console.log("Created location for donor:", donorId);
        }
      }
    } else {
      console.log("Anonymous donation - no email provided");
      // Handle anonymous donation (no email)
      const { error: anonDonationError } = await supabase
        .from("donations")
        .insert({
          ...donationData,
          donor_id: null,
        });
        
      if (anonDonationError) {
        console.error("Error creating anonymous donation:", anonDonationError);
      } else {
        console.log("Created anonymous donation");
      }
    }

    // Update webhook last_used_at timestamp
    const { error: webhookError } = await supabase
      .from("webhooks")
      .update({ last_used_at: new Date().toISOString() })
      .eq("is_active", true);
      
    if (webhookError) {
      console.error("Error updating webhook last_used_at:", webhookError);
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Donation processed successfully",
      donation: donationData,
      donor: donorId ? { id: donorId, ...donorData } : null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
