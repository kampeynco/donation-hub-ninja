
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

    // Parse the request body (ActBlue payload)
    const payload: ActBlueWebhookPayload = await req.json();
    console.log("Received ActBlue webhook payload:", JSON.stringify(payload));

    // Process ActBlue payload
    if (!payload || !payload.contribution) {
      throw new Error("Invalid ActBlue payload format");
    }

    const { contribution } = payload;
    
    // Extract relevant data from the contribution
    const donationData = {
      amount: parseFloat(contribution.amount) || 0,
      paid_at: new Date(contribution.orderDate).toISOString(),
      is_mobile: contribution.mobileDevice || false,
      recurring_period: contribution.recurringFrequency === 'monthly' ? 'monthly' : 
                        contribution.recurringFrequency === 'weekly' ? 'weekly' : 'once',
      recurring_duration: contribution.recurringDuration || 0,
      express_signup: contribution.expressSignup || false,
      is_express: contribution.express || false,
      payment_type: contribution.paymentType || null,
    };

    // Extract donor information
    const donorData = {
      first_name: contribution.donor?.firstName || null,
      last_name: contribution.donor?.lastName || null,
      is_express: contribution.express || false,
      is_mobile: contribution.mobileDevice || false,
      is_paypal: contribution.paymentType?.toLowerCase().includes('paypal') || false,
    };

    // Create or update donor
    let donorId;
    if (contribution.donor?.email) {
      // Try to find existing donor by email
      const { data: existingEmail } = await supabase
        .from("emails")
        .select("donor_id, email")
        .eq("email", contribution.donor.email)
        .maybeSingle();

      if (existingEmail?.donor_id) {
        // Update existing donor
        donorId = existingEmail.donor_id;
        await supabase
          .from("donors")
          .update(donorData)
          .eq("id", donorId);
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

        // Create email record
        await supabase
          .from("emails")
          .insert({
            email: contribution.donor.email,
            donor_id: donorId,
          });
      }

      // Create donation record
      await supabase
        .from("donations")
        .insert({
          ...donationData,
          donor_id: donorId,
        });
        
      // Handle address if provided
      if (contribution.donor.address) {
        const { street1, street2, city, state, zip, country } = contribution.donor.address;
        
        if (street1 || city || state) {
          await supabase
            .from("locations")
            .insert({
              donor_id: donorId,
              street: street1 + (street2 ? `, ${street2}` : ''),
              city,
              state,
              zip,
              country,
              type: 'main'
            });
        }
      }
    } else {
      // Handle anonymous donation (no email)
      await supabase
        .from("donations")
        .insert({
          ...donationData,
          donor_id: null,
        });
    }

    // Update webhook last_used_at timestamp
    // Since we don't require specific webhook identification anymore,
    // let's update all active webhooks (typically there would be just one)
    await supabase
      .from("webhooks")
      .update({ last_used_at: new Date().toISOString() })
      .eq("is_active", true);

    // Return success response
    return new Response(JSON.stringify({ success: true, message: "Donation processed successfully" }), {
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
