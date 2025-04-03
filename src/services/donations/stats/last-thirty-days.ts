
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "../helpers";

/**
 * Helper function to fetch last 30 days stats
 */
export async function fetchLastThirtyDaysStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { total: 0, count: 0 };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
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
    
    // Use extracted donor IDs array to get donations
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .in('donor_id', donorIds)
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (error) throw error;
    
    const total = data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    return {
      total,
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching last 30 days stats:', error);
    return { total: 0, count: 0 };
  }
}
