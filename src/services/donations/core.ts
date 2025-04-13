
import { Donation } from "@/types/donation";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentUserId, 
  fetchDonorEmails, 
  formatDonation, 
  handleDonationError 
} from "./helpers";

/**
 * Main function to fetch recent donations
 */
export async function fetchRecentDonations(limit = 30): Promise<Donation[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning empty donations array');
      return [];
    }

    // First get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      throw userContactsError;
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    if (contactIds.length === 0) {
      console.log('No contacts associated with this user');
      return [];
    }
    
    // Query donations using the extracted contact IDs array and include recurring info
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        paid_at,
        created_at,
        recurring_period,
        recurring_duration,
        contacts:contact_id (
          id,
          first_name,
          last_name
        )
      `)
      .in('contact_id', contactIds)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Fetch emails for contacts
    const contactEmails = await fetchDonorEmails(data || []);
    
    // Format donation data
    return (data || []).map((item: any) => formatDonation(item, contactEmails));
  } catch (error) {
    handleDonationError(error, "Error fetching donations");
    return [];
  }
}
