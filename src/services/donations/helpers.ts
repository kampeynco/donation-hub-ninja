
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Donation } from "@/types/donation";

/**
 * Helper function for formatting a donation
 */
export function formatDonation(item: any, donoEmails: Map<string, string>): Donation {
  return {
    id: item.id,
    date: new Date(item.paid_at || item.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    name: item.contacts ? 
      `${item.contacts.first_name || ''} ${item.contacts.last_name || ''}`.trim() || 'Anonymous' 
      : 'Anonymous',
    email: item.contacts ? donoEmails.get(item.contacts.id) || null : null,
    amount: Number(item.amount),
    recurringPeriod: item.recurring_period || null,
    recurringDuration: item.recurring_duration !== undefined ? Number(item.recurring_duration) : undefined
  };
}

/**
 * Helper function to fetch donor emails
 * Optimized to use a single query instead of multiple queries in a loop
 * And now ensures we only get emails for donors associated with the current user
 */
export async function fetchDonorEmails(donations: any[]): Promise<Map<string, string>> {
  const donoEmails = new Map();
  
  // Extract unique contact IDs
  const contactIds = [...new Set(
    donations
      .filter(donation => donation.contacts && donation.contacts.id)
      .map(donation => donation.contacts.id)
  )];
  
  if (contactIds.length === 0) {
    return donoEmails;
  }
  
  try {
    // Get current user ID to ensure we only fetch emails for contacts associated with this user
    const userId = await getCurrentUserId();
    if (!userId) {
      return donoEmails;
    }

    // First get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      console.error('Error fetching user contacts:', userContactsError);
      return donoEmails;
    }
    
    // Extract user's contact IDs as an array
    const userContactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    // Only proceed with contact IDs that belong to this user
    const validContactIds = contactIds.filter(id => userContactIds.includes(id));

    if (validContactIds.length === 0) {
      return donoEmails;
    }

    // Fetch all emails with a single query, ensuring they belong to the current user's contacts
    const { data: emailData, error } = await supabase
      .from('emails')
      .select('email, contact_id')
      .in('contact_id', validContactIds)
      .eq('is_primary', true);
      
    if (error) {
      console.error('Error fetching contact emails:', error);
      return donoEmails;
    }
      
    // Build the map from the results
    if (emailData && emailData.length > 0) {
      emailData.forEach(item => {
        donoEmails.set(item.contact_id, item.email);
      });
    }
  } catch (error) {
    console.error('Error in bulk email fetch:', error);
  }
  
  return donoEmails;
}

/**
 * Helper function to get the current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Function to handle errors in donation service
 */
export function handleDonationError(error: any, message: string) {
  console.error(`${message}:`, error);
  toast({
    title: message,
    description: "Could not load donation data",
    variant: "destructive"
  });
}
