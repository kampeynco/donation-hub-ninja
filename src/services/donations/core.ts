
import { Donation } from "@/types/donation";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentUserId, 
  fetchDonorEmails, 
  formatDonation, 
  handleDonationError 
} from "./helpers";

// Cache donations to reduce duplicate fetches
let donationsCache: { data: Donation[]; timestamp: number } | null = null;
const CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes

/**
 * Main function to fetch recent donations with caching
 */
export async function fetchRecentDonations(limit = 30): Promise<Donation[]> {
  try {
    // Check cache validity
    const now = Date.now();
    if (donationsCache && (now - donationsCache.timestamp < CACHE_LIFETIME)) {
      console.log('Using cached donations data');
      return donationsCache.data;
    }
    
    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning empty donations array');
      return [];
    }

    // Fetch donor IDs associated with the current user in a single optimized query
    const { data: userDonors, error: userDonorsError } = await supabase
      .from('user_donors')
      .select('donor_id')
      .eq('user_id', userId);
    
    if (userDonorsError) {
      throw userDonorsError;
    }
    
    // Extract donor IDs as an array
    const donorIds = userDonors?.map(ud => ud.donor_id) || [];
    
    if (donorIds.length === 0) {
      console.log('No donors associated with this user');
      // Update cache with empty array
      donationsCache = { data: [], timestamp: now };
      return [];
    }
    
    // Fetch donations with donor information in a single query
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        paid_at,
        created_at,
        recurring_period,
        recurring_duration,
        donors:donor_id (
          id,
          first_name,
          last_name
        )
      `)
      .in('donor_id', donorIds)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Fetch emails for donors in a single batch operation
    const donoEmails = await fetchDonorEmails(data || []);
    
    // Format donations
    const formattedDonations = (data || []).map((item: any) => 
      formatDonation(item, donoEmails)
    );
    
    // Update cache
    donationsCache = { data: formattedDonations, timestamp: now };
    
    return formattedDonations;
  } catch (error) {
    handleDonationError(error, "Error fetching donations");
    return [];
  }
}

/**
 * Function to clear the donations cache
 * Call this when you need to force a fresh fetch
 */
export function clearDonationsCache(): void {
  donationsCache = null;
  console.log('Donations cache cleared');
}
