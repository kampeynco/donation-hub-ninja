
import { UserProfile } from "../types.ts";

// Configure Plivo client
const plivoAuthId = Deno.env.get("PLIVO_API_KEY") || "";
const plivoAuthToken = Deno.env.get("PLIVO_AUTH_TOKEN") || "";
const plivoPhoneNumber = Deno.env.get("PLIVO_PHONE_NUMBER") || "18445096979"; // Use environment variable with fallback

export async function sendSmsNotification(
  profile: UserProfile,
  amount: number,
  donorName: string,
  donationType: string,
  requestId: string
): Promise<boolean> {
  if (!plivoAuthId || !plivoAuthToken) {
    console.log(`[${requestId}] Plivo credentials not configured, skipping SMS notification`);
    return false;
  }

  if (!profile.mobile_phone) {
    console.log(`[${requestId}] No mobile phone found for user, skipping SMS notification`);
    return false;
  }

  try {
    const smsMessage = donationType === 'recurring' 
      ? `Donor Camp: Recurring donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`
      : `Donor Camp: New donation of $${amount.toFixed(2)} received from ${donorName || 'Anonymous'}`;
      
    // Format mobile phone for Plivo (remove any non-digit characters)
    const formattedPhone = profile.mobile_phone.replace(/\D/g, '');
    
    // Construct Plivo API URL
    const plivoApiUrl = 'https://api.plivo.com/v1/Account/' + plivoAuthId + '/Message/';
    
    // Prepare authorization header for Plivo API
    const authHeader = 'Basic ' + btoa(plivoAuthId + ':' + plivoAuthToken);
    
    // Log the phone number being used (for debugging)
    console.log(`[${requestId}] Using Plivo phone number: ${plivoPhoneNumber}`);
    
    // Send SMS using Plivo API
    const plivoResponse = await fetch(plivoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        src: plivoPhoneNumber, // Use the environment variable instead of hardcoded number
        dst: formattedPhone,
        text: smsMessage
      })
    });
    
    const responseData = await plivoResponse.json();
    console.log(`[${requestId}] SMS sent successfully with Plivo:`, responseData);
    return true;
  } catch (error) {
    console.error(`[${requestId}] Error sending SMS with Plivo:`, error);
    return false;
  }
}
