
import { supabase } from "@/integrations/supabase/client";
import { findMatchingContact } from "@/services/contacts/duplicates";
import { toast } from "@/components/ui/use-toast";
import type { Contact } from "@/types/contact";

/**
 * Process a webhook payload for contact matching and donation tracking
 * @param webhookData The raw webhook data from ActBlue
 * @returns Success status and any matching contact info
 */
export async function processWebhookData(webhookData: any): Promise<{ 
  success: boolean; 
  matchedContact?: Contact | null;
  donationId?: string;
}> {
  try {
    if (!webhookData || typeof webhookData !== 'object') {
      console.error('Invalid webhook data format');
      return { success: false };
    }
    
    // Extract contact information from the webhook data
    const contactData = extractContactData(webhookData);
    
    if (!contactData.email && !contactData.phone) {
      console.log('Webhook data missing key contact identifiers (email/phone)');
      return { success: false };
    }
    
    // Try to find a matching contact with at least 90% confidence
    const { contact: matchedContact, confidenceScore } = await findMatchingContact(contactData, 90);
    
    if (matchedContact) {
      // A matching contact was found with high confidence
      console.log(`Found matching contact with ${confidenceScore}% confidence`, matchedContact.id);
      
      // Extract donation information from the webhook
      const donationData = extractDonationData(webhookData, matchedContact.id);
      
      if (donationData) {
        // Save the donation linked to this contact
        const { data, error } = await supabase
          .from('donations')
          .insert([donationData])
          .select('id')
          .single();
          
        if (error) {
          console.error('Failed to save donation:', error);
        } else {
          // Try to create a notification about the new donation
          await createDonationNotification(matchedContact, donationData.amount);
          
          return { 
            success: true, 
            matchedContact, 
            donationId: data.id 
          };
        }
      }
      
      return { success: true, matchedContact };
    } else {
      // No clear match was found, create a new contact
      console.log('No matching contact found, creating new contact');
      
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert([{
          first_name: contactData.first_name,
          last_name: contactData.last_name,
          status: 'prospect'
        }])
        .select('id')
        .single();
        
      if (error) {
        console.error('Failed to create new contact:', error);
        return { success: false };
      }
      
      // Add contact details (email, phone, etc.)
      await saveContactDetails(newContact.id, contactData);
      
      // Extract donation information for the new contact
      const donationData = extractDonationData(webhookData, newContact.id);
      
      if (donationData) {
        const { data, error } = await supabase
          .from('donations')
          .insert([donationData])
          .select('id')
          .single();
          
        if (error) {
          console.error('Failed to save donation for new contact:', error);
        } else {
          return { 
            success: true,
            donationId: data.id 
          };
        }
      }
      
      return { success: true };
    }
  } catch (error) {
    console.error('Error processing webhook data:', error);
    return { success: false };
  }
}

/**
 * Extract contact information from webhook payload
 */
function extractContactData(webhookData: any): {
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  phone?: string;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
} {
  try {
    const contactInfo: any = {};
    
    // Handle different webhook payload formats
    const contribution = webhookData.contribution || webhookData || {};
    const donor = contribution.donor || webhookData.donor || {};
    const address = donor.address || contribution.address || {};
    
    // Extract basic contact info
    if (donor.firstName || contribution.firstName) {
      contactInfo.first_name = donor.firstName || contribution.firstName;
    }
    
    if (donor.lastName || contribution.lastName) {
      contactInfo.last_name = donor.lastName || contribution.lastName;
    }
    
    // Extract email
    if (donor.email || contribution.email) {
      contactInfo.email = donor.email || contribution.email;
    }
    
    // Extract phone
    if (donor.phone || contribution.phone) {
      contactInfo.phone = donor.phone || contribution.phone;
    }
    
    // Extract location data
    if (address) {
      contactInfo.city = address.city;
      contactInfo.state = address.state;
      contactInfo.zip = address.zip;
    }
    
    return contactInfo;
  } catch (error) {
    console.error('Error extracting contact data from webhook:', error);
    return {};
  }
}

/**
 * Extract donation information from webhook payload
 */
function extractDonationData(webhookData: any, contactId: string): any {
  try {
    const contribution = webhookData.contribution || webhookData || {};
    
    // Basic donation data
    const donationData: any = {
      contact_id: contactId,
      amount: parseFloat(contribution.amount || 0),
      paid_at: new Date().toISOString(),
      status: 'processed'
    };
    
    // Check for recurring donation
    if (contribution.recurringFrequency) {
      donationData.recurring_period = mapRecurringFrequency(contribution.recurringFrequency);
      
      if (contribution.recurringDuration) {
        donationData.recurring_duration = parseInt(contribution.recurringDuration, 10);
      }
    }
    
    // Additional metadata
    if (contribution.committeeId) {
      donationData.committee_name = contribution.committeeId;
    }
    
    if (contribution.formName) {
      donationData.contribution_form = contribution.formName;
    }
    
    if (contribution.orderNumber) {
      donationData.order_number = contribution.orderNumber;
    }
    
    // Payment method flags
    if (contribution.paymentMethod) {
      const paymentMethod = contribution.paymentMethod.toLowerCase();
      donationData.is_express = paymentMethod.includes('express');
      donationData.is_paypal = paymentMethod.includes('paypal');
      donationData.is_mobile = webhookData.source === 'mobile' || contribution.mobile === true;
    }
    
    return donationData;
  } catch (error) {
    console.error('Error extracting donation data from webhook:', error);
    return null;
  }
}

/**
 * Map ActBlue recurring frequency to our system's format
 */
function mapRecurringFrequency(frequency: string): string | null {
  const mapping: Record<string, string> = {
    'weekly': 'weekly',
    'biweekly': 'biweekly',
    'monthly': 'monthly',
    'quarterly': 'quarterly',
    'yearly': 'yearly'
  };
  
  return mapping[frequency.toLowerCase()] || null;
}

/**
 * Save contact details (email, phone, location) to the database
 */
async function saveContactDetails(
  contactId: string,
  contactData: {
    email?: string;
    phone?: string;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  }
): Promise<void> {
  // Save email if available
  if (contactData.email) {
    await supabase.from('emails').insert([{
      contact_id: contactId,
      email: contactData.email,
      type: 'personal',
      is_primary: true
    }]);
  }
  
  // Save phone if available
  if (contactData.phone) {
    await supabase.from('phones').insert([{
      contact_id: contactId,
      phone: contactData.phone,
      type: 'mobile',
      is_primary: true
    }]);
  }
  
  // Save location if available
  if (contactData.city || contactData.state || contactData.zip) {
    await supabase.from('locations').insert([{
      contact_id: contactId,
      city: contactData.city,
      state: contactData.state,
      zip: contactData.zip,
      type: 'main',
      is_primary: true
    }]);
  }
}

/**
 * Create a notification for a new donation
 * Privacy-aware: doesn't include donor details
 */
async function createDonationNotification(
  contact: Contact,
  amount: number
): Promise<boolean> {
  try {
    // First, get the user(s) associated with this contact
    const { data: userContacts, error: ucError } = await supabase
      .from('user_contacts')
      .select('user_id')
      .eq('contact_id', contact.id);
      
    if (ucError || !userContacts?.length) {
      console.error('No users found for contact', contact.id);
      return false;
    }
    
    // For each associated user, create a donation notification
    for (const userContact of userContacts) {
      const { error } = await supabase.from('notifications').insert({
        action: 'donor', // Use 'donor' instead of 'donation' to match the enum type
        contact_id: contact.id,
        message: `New donation of $${amount.toFixed(2)} received`,
        is_read: false,
      });
      
      if (error) {
        console.error('Failed to create donation notification:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error creating donation notification:', error);
    return false;
  }
}

/**
 * Store raw webhook data for debugging or reprocessing
 */
export async function storeWebhookData(
  webhookId: string, 
  payload: any
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('webhook_data')
      .insert([{
        webhook_id: webhookId,
        payload,
        processed: false
      }]);
      
    if (error) {
      console.error('Failed to store webhook data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing webhook data:', error);
    return false;
  }
}

/**
 * Update webhook data processing status
 */
export async function updateWebhookProcessingStatus(
  dataId: string,
  processed: boolean,
  error?: string
): Promise<boolean> {
  try {
    const { error: updateError } = await supabase
      .from('webhook_data')
      .update({
        processed,
        error: error || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', dataId);
      
    if (updateError) {
      console.error('Failed to update webhook processing status:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating webhook processing status:', error);
    return false;
  }
}
