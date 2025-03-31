
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

    // Query using the user_donors junction table to enforce RLS
    // This ensures we only get donations for donors associated with the current user
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        paid_at,
        created_at,
        donors:donor_id (
          id,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Fetch emails for donors
    const donoEmails = await fetchDonorEmails(data || []);
    
    // Format donation data
    return (data || []).map((item: any) => formatDonation(item, donoEmails));
  } catch (error) {
    handleDonationError(error, "Error fetching donations");
    return [];
  }
}
