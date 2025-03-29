
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { Resend } from "npm:resend@2.0.0";
import twilio from "npm:twilio@4.17.0";

// Configure clients
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const twilioAccountSid = Deno.env.get("TWILIO_API_SID") || "";
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN") || "";

const resend = new Resend(resendApiKey);
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

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
    
    // Get user profile for committee name and contact info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('committee_name, contact_first_name, contact_last_name, mobile_phone')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error(`[${requestId}] Error fetching user profile:`, profileError);
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }

    const recipientName = profile.contact_first_name 
      ? `${profile.contact_first_name} ${profile.contact_last_name || ''}`
      : `${profile.committee_name} Team`;
    
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
    
    // Handle email notification using Resend
    if (emailEnabled && resendApiKey) {
      try {
        const emailSubject = donationType === 'recurring' 
          ? `Recurring Donation Received: $${amount.toFixed(2)}`
          : `New Donation Received: $${amount.toFixed(2)}`;
          
        const emailHtml = `
          <div style="font-family: 'Inter', system-ui, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007AFF;">Donation Received</h1>
            <p>Hello ${recipientName},</p>
            <p>A ${donationType === 'recurring' ? 'recurring' : 'new'} donation of <strong>$${amount.toFixed(2)}</strong> has been received from ${donorName || 'Anonymous'}.</p>
            <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #007AFF; background-color: #f5f5f7;">
              <p style="margin: 0 0 10px 0;"><strong>Donation Details:</strong></p>
              <p style="margin: 0;">Amount: $${amount.toFixed(2)}</p>
              <p style="margin: 0;">Type: ${donationType === 'recurring' ? 'Recurring' : 'One-time'}</p>
              <p style="margin: 0;">Donor: ${donorName || 'Anonymous'}</p>
            </div>
            <p>Log in to your Donor Camp dashboard to view the full details.</p>
            <p>Thank you,<br>Donor Camp</p>
          </div>
        `;
        
        const emailData = {
          from: "Donor Camp <notifications@donorcamp.app>",
          to: donorEmail || '',
          subject: emailSubject,
          html: emailHtml
        };

        // Send email if there's a valid recipient
        if (donorEmail) {
          const emailResponse = await resend.emails.send(emailData);
          console.log(`[${requestId}] Email sent successfully:`, emailResponse);
        } else {
          console.log(`[${requestId}] No valid email address to send notification`);
        }
      } catch (error) {
        console.error(`[${requestId}] Error sending email:`, error);
      }
    }
    
    // Handle SMS notification using Twilio
    if (textEnabled && twilioAccountSid && twilioAuthToken) {
      try {
        // Get user profile for mobile phone
        if (!profile.mobile_phone) {
          console.log(`[${requestId}] No mobile phone found for user, skipping SMS notification`);
        } else {
          const smsMessage = donationType === 'recurring' 
            ? `Donor Camp: Recurring donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`
            : `Donor Camp: New donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`;
            
          const twilioResponse = await twilioClient.messages.create({
            body: smsMessage,
            to: profile.mobile_phone,
            from: '+18445096979' // Replace with your Twilio phone number
          });
          
          console.log(`[${requestId}] SMS sent successfully with SID:`, twilioResponse.sid);
        }
      } catch (error) {
        console.error(`[${requestId}] Error sending SMS:`, error);
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
