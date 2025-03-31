
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

    // Get related donor IDs from the user_donors junction table
    const { data: userDonorsData } = await supabase
      .from("user_donors")
      .select("donor_id")
      .eq("user_id", userId);
    
    const donorIds = userDonorsData ? userDonorsData.map(ud => ud.donor_id) : [];
    
    // If there are donor associations, handle related data
    if (donorIds.length > 0) {
      for (const donorId of donorIds) {
        // First check if this donor is associated with only this user or multiple users
        const { count: userCount, error: countError } = await supabase
          .from("user_donors")
          .select("*", { count: "exact", head: true })
          .eq("donor_id", donorId);
        
        if (countError) {
          console.error(`Error counting users for donor ${donorId}: ${countError.message}`);
          continue;
        }
        
        // If this is the only user associated with the donor, delete the donor and related data
        if (userCount === 1) {
          console.log(`Donor ${donorId} is only associated with this user, deleting donor and related data`);
          
          // Get donations for this donor
          const { data: donationsData } = await supabase
            .from("donations")
            .select("id")
            .eq("donor_id", donorId);
          
          if (donationsData && donationsData.length > 0) {
            for (const donation of donationsData) {
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
            
            // Delete all donations for this donor
            await supabase
              .from("donations")
              .delete()
              .eq("donor_id", donorId);
          }
          
          // Delete emails for this donor
          await supabase
            .from("emails")
            .delete()
            .eq("donor_id", donorId);
          
          // Delete phones for this donor
          await supabase
            .from("phones")
            .delete()
            .eq("donor_id", donorId);
          
          // Delete locations for this donor
          await supabase
            .from("locations")
            .delete()
            .eq("donor_id", donorId);
          
          // Delete employer data for this donor
          await supabase
            .from("employer_data")
            .delete()
            .eq("donor_id", donorId);
          
          // Finally delete the donor
          await supabase
            .from("donors")
            .delete()
            .eq("id", donorId);
        } else {
          console.log(`Donor ${donorId} is associated with multiple users, keeping donor data and just removing association`);
        }
      }
      
      // Delete user's associations in the user_donors table
      await supabase
        .from("user_donors")
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
