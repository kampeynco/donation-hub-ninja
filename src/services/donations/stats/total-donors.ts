
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "../helpers";

/**
 * Helper function to fetch total unique donors
 */
export async function fetchTotalDonorsCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    // Get count of unique donors associated with the current user
    const { count, error } = await supabase
      .from('user_donors')
      .select('donor_id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching total donors count:', error);
    return 0;
  }
}
