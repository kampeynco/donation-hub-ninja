
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "../helpers";

/**
 * Helper function to fetch all time stats
 */
export async function fetchAllTimeStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { total: 0, count: 0 };
    }

    // First get donor IDs associated with the current user
    const { data: userDonors, error: userDonorsError } = await supabase
      .from('user_donors')
      .select('donor_id')
      .eq('user_id', userId);
    
    if (userDonorsError) {
      console.error('Error fetching user donors:', userDonorsError);
      return { total: 0, count: 0 };
    }
    
    // Extract donor IDs as an array
    const donorIds = userDonors?.map(ud => ud.donor_id) || [];
    
    if (donorIds.length === 0) {
      return { total: 0, count: 0 };
    }
    
    // Use extracted donor IDs array to get all donations
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .in('donor_id', donorIds);
    
    if (error) throw error;
    
    const total = data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    return {
      total,
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching all time stats:', error);
    return { total: 0, count: 0 };
  }
}
