
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
    // Create Supabase client using service role key (has admin privileges)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from request body
    const { userId, reason } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing required field: userId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Processing account deletion request for user: ${userId}. Reason: ${reason}`);
    
    // 1. Delete associated data first
    // This ensures all user-related data is cleaned up before the user is deleted

    // Get related donor data
    const { data: donorData } = await supabase
      .from("donors")
      .select("id")
      .eq("user_id", userId);
    
    // If there are donor records, delete all related data
    if (donorData && donorData.length > 0) {
      for (const donor of donorData) {
        // Delete related custom fields
        const { data: donationData } = await supabase
          .from("donations")
          .select("id")
          .eq("donor_id", donor.id);
        
        if (donationData && donationData.length > 0) {
          for (const donation of donationData) {
            // Delete custom fields for this donation
            await supabase
              .from("custom_fields")
              .delete()
              .eq("donation_id", donation.id);
              
            // Delete merchandise for this donation
            await supabase
              .from("merchandise")
              .delete()
              .eq("donation_id", donation.id);
          }
          
          // Delete donations linked to this donor
          await supabase
            .from("donations")
            .delete()
            .eq("donor_id", donor.id);
        }
        
        // Delete emails for this donor
        await supabase
          .from("emails")
          .delete()
          .eq("donor_id", donor.id);
          
        // Delete phones for this donor
        await supabase
          .from("phones")
          .delete()
          .eq("donor_id", donor.id);
          
        // Delete locations for this donor
        await supabase
          .from("locations")
          .delete()
          .eq("donor_id", donor.id);
          
        // Delete employer data for this donor
        await supabase
          .from("employer_data")
          .delete()
          .eq("donor_id", donor.id);
      }
      
      // Delete donors records
      await supabase
        .from("donors")
        .delete()
        .eq("user_id", userId);
    }
    
    // Delete webhook data
    const { error: webhookError } = await supabase
      .from("webhooks")
      .delete()
      .eq("user_id", userId);
      
    if (webhookError) {
      console.log(`Error deleting webhook data: ${webhookError.message}`);
      // Continue with deletion even if this fails
    }
    
    // Delete notification settings
    const { error: notificationSettingsError } = await supabase
      .from("notification_settings")
      .delete()
      .eq("user_id", userId);
      
    if (notificationSettingsError) {
      console.log(`Error deleting notification settings: ${notificationSettingsError.message}`);
      // Continue with deletion even if this fails
    }
    
    // Delete notifications
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);
    
    // Delete profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
      
    if (profileError) {
      console.log(`Error deleting profile: ${profileError.message}`);
      // Continue with deletion even if this fails
    }
    
    // 2. Finally, delete the user account
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (userDeleteError) {
      console.error("Error deleting user:", userDeleteError);
      return new Response(JSON.stringify({ 
        error: userDeleteError.message,
        success: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "User account and associated data deleted successfully",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in delete-user-account function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
