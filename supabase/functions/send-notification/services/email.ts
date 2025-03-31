
import { Resend } from "npm:resend@2.0.0";
import { UserProfile } from "../types.ts";

// Configure Resend client
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
export const resend = new Resend(resendApiKey);

export async function sendEmailNotification(
  recipientEmail: string,
  subject: string,
  recipientName: string,
  amount: number,
  donorName: string,
  donationType: string,
  actionType: 'donation' | 'recurring_donation' | 'weekly_report' | 'marketing_update',
  requestId: string
): Promise<boolean> {
  if (!resendApiKey) {
    console.log(`[${requestId}] Resend API key not configured, skipping email notification`);
    return false;
  }

  if (!recipientEmail) {
    console.log(`[${requestId}] No recipient email provided, skipping email notification`);
    return false;
  }

  try {
    // Determine the sender email address based on notification action type
    const senderEmail = getSenderEmailAddress(actionType);
    
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
      from: `Donor Camp <${senderEmail}>`,
      to: recipientEmail,
      subject: subject,
      html: emailHtml
    };

    const emailResponse = await resend.emails.send(emailData);
    console.log(`[${requestId}] Email sent successfully from ${senderEmail}:`, emailResponse);
    return true;
  } catch (error) {
    console.error(`[${requestId}] Error sending email:`, error);
    return false;
  }
}

/**
 * Determine the sender email address based on notification action type
 */
function getSenderEmailAddress(actionType: string): string {
  switch(actionType) {
    case 'donation':
    case 'recurring_donation':
      return "donor@alerts.donorcamp.pro";
    case 'weekly_report':
    case 'marketing_update': // Changed marketing_update to use the account email domain
      return "account@alerts.donorcamp.pro";
    default:
      return "no-reply@alerts.donorcamp.pro";
  }
}

export function getRecipientName(profile: UserProfile): string {
  return profile.contact_first_name 
    ? `${profile.contact_first_name} ${profile.contact_last_name || ''}`
    : `${profile.committee_name} Team`;
}
