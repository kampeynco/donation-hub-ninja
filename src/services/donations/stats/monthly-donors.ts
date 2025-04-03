
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "../helpers";

/**
 * Helper function to fetch monthly donors count
 */
export async function fetchMonthlyDonorsCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    // First get donor IDs associated with the current user
    const { data: userDonors, error: userDonorsError } = await supabase
      .from('user_donors')
      .select('donor_id')
      .eq('user_id', userId);
    
    if (userDonorsError) {
      console.error('Error fetching user donors:', userDonorsError);
      return 0;
    }
    
    // Extract donor IDs as an array
    const donorIds = userDonors?.map(ud => ud.donor_id) || [];
    
    if (donorIds.length === 0) {
      return 0;
    }
    
    // Use extracted donor IDs array to get monthly donors
    const { count, error } = await supabase
      .from('donations')
      .select('donor_id', { count: 'exact', head: true })
      .in('donor_id', donorIds)
      .not('recurring_period', 'eq', 'once');
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching monthly donors count:', error);
    return 0;
  }
}
