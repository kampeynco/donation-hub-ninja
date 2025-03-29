
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Configure Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface NotificationRequest {
  userId: string;
  donationId: string;
  amount: number;
  donorId: string;
  donorName: string | null;
  donorEmail: string | undefined;
  donationType: 'recurring' | 'one_time';
  requestId: string;
}

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
    // Parse request body
    const payload: NotificationRequest = await req.json();
    const { userId, donationId, amount, donorId, donorName, donorEmail, donationType, requestId } = payload;
    
    console.log(`[${requestId}] Processing notification for ${donationType} donation ${donationId}`);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user notification preferences
    const { data: notificationSettings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (settingsError) {
      throw new Error(`Error fetching notification settings: ${settingsError.message}`);
    }
    
    // Based on donationType, determine which notification preferences to use
    const webEnabled = donationType === 'recurring' ? 
      notificationSettings.recurring_web : 
      notificationSettings.donations_web;
      
    const emailEnabled = donationType === 'recurring' ? 
      notificationSettings.recurring_email : 
      notificationSettings.donations_email;
      
    const textEnabled = donationType === 'recurring' ? 
      notificationSettings.recurring_text : 
      notificationSettings.donations_text;
    
    // Handle web notification (create entry in notifications table)
    if (webEnabled) {
      const message = donationType === 'recurring' 
        ? `Recurring donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`
        : `Donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`;
        
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          message,
          action: donationType === 'recurring' ? 'recurring_donation' : 'donation',
          donor_id: donorId,
          is_read: false
        });
      
      if (notificationError) {
        console.error(`[${requestId}] Error creating web notification:`, notificationError);
      } else {
        console.log(`[${requestId}] Web notification created successfully`);
      }
    }
    
    // Handle email notification (if enabled and user has profile data)
    if (emailEnabled) {
      // Get user profile for committee name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('committee_name, contact_first_name')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error(`[${requestId}] Error fetching user profile:`, profileError);
      } else {
        // For demonstration, we'll just log the email that would be sent
        // In a real implementation, this would call Resend or similar email service
        const emailSubject = donationType === 'recurring' 
          ? `Recurring Donation Received: $${amount.toFixed(2)}`
          : `New Donation Received: $${amount.toFixed(2)}`;
          
        const emailBody = `
          Hello ${profile.contact_first_name || `${profile.committee_name} Team`},
          
          A ${donationType === 'recurring' ? 'recurring' : 'new'} donation of $${amount.toFixed(2)} has been received from ${donorName || 'Anonymous'}.
          
          Log in to your Donor Camp dashboard to view the details.
          
          Thank you,
          Donor Camp Team
        `;
        
        console.log(`[${requestId}] Email notification would be sent:`, {
          to: donorEmail,
          subject: emailSubject,
          body: emailBody
        });
      }
    }
    
    // Handle SMS notification (if enabled and user has mobile phone)
    if (textEnabled) {
      // Get user profile for mobile phone
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('mobile_phone')
        .eq('id', userId)
        .single();
      
      if (profileError || !profile.mobile_phone) {
        console.error(`[${requestId}] Error fetching user mobile phone or phone not set:`, profileError);
      } else {
        // For demonstration, we'll just log the SMS that would be sent
        // In a real implementation, this would call Twilio or similar SMS service
        const smsMessage = donationType === 'recurring' 
          ? `Recurring donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`
          : `New donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`;
          
        console.log(`[${requestId}] SMS notification would be sent:`, {
          to: profile.mobile_phone,
          message: smsMessage
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notifications processed successfully" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
