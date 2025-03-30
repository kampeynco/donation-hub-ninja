
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { NotificationRequest } from "./types.ts";
import { corsHeaders } from "./utils/corsHeaders.ts";
import { 
  getUserNotificationSettings, 
  getUserProfile, 
  createWebNotification 
} from "./services/database.ts";
import { 
  sendEmailNotification, 
  getRecipientName 
} from "./services/email.ts";
import { sendSmsNotification } from "./services/sms.ts";

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
    
    // Get user notification preferences
    const notificationSettings = await getUserNotificationSettings(userId);
    
    if (!notificationSettings) {
      throw new Error(`Error fetching notification settings for user ${userId}`);
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
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      throw new Error(`Error fetching user profile for user ${userId}`);
    }

    const recipientName = getRecipientName(profile);
    
    // Handle web notification (create entry in notifications table)
    if (webEnabled) {
      const message = donationType === 'recurring' 
        ? `Recurring donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`
        : `Donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`;
        
      await createWebNotification(
        message, 
        donationType === 'recurring' ? 'recurring_donation' : 'donation',
        donorId,
        requestId
      );
    }
    
    // Handle email notification - FIXED: Now using the committee owner's email from profile
    if (emailEnabled && profile.contact_email) {
      const emailSubject = donationType === 'recurring' 
        ? `Recurring Donation Received: $${amount.toFixed(2)}`
        : `New Donation Received: $${amount.toFixed(2)}`;
        
      await sendEmailNotification(
        profile.contact_email, // Use committee owner's email instead of donor's email
        emailSubject,
        recipientName,
        amount,
        donorName || 'Anonymous',
        donationType,
        requestId
      );
    } else if (emailEnabled) {
      // Log error if email notification is enabled but no contact email is available
      console.error(`[${requestId}] Email notification enabled but no contact email found for user ${userId}`);
    }
    
    // Handle SMS notification
    if (textEnabled) {
      await sendSmsNotification(
        profile,
        amount,
        donorName || 'Anonymous',
        donationType,
        requestId
      );
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
