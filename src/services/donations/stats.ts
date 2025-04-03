
import { DonationStats } from "@/types/donation";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId, handleDonationError } from "./helpers";

/**
 * Helper function to fetch recent activity (notifications from the last 24 hours)
 */
async function fetchRecentActivityCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    // Count notifications from the last 24 hours
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .gte('date', oneDayAgo.toISOString());
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching recent activity count:', error);
    return 0;
  }
}

/**
 * Helper function to fetch total unique donors
 */
async function fetchTotalDonorsCount() {
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

/**
 * Helper function to fetch last 30 days stats
 */
async function fetchLast30DaysStats() {
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

/**
 * Helper function to fetch all time stats
 */
async function fetchAllTimeStats() {
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

/**
 * Helper function to fetch monthly donors count
 */
async function fetchMonthlyDonorsCount() {
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

/**
 * Main function to fetch donation stats
 */
export async function fetchDonationStats(): Promise<DonationStats> {
  try {
    // Fetch all stats in parallel for better performance
    const [lastThirtyDays, allTime, monthlyDonorsCount, recentActivityCount, totalDonorsCount] = await Promise.all([
      fetchLast30DaysStats(),
      fetchAllTimeStats(),
      fetchMonthlyDonorsCount(),
      fetchRecentActivityCount(),
      fetchTotalDonorsCount()
    ]);
    
    return {
      lastThirtyDays,
      allTime,
      monthly: {
        donors: monthlyDonorsCount
      },
      recentActivity: {
        count: recentActivityCount
      },
      totalDonors: {
        count: totalDonorsCount
      }
    };
  } catch (error) {
    handleDonationError(error, "Error fetching donation stats");
    return {
      lastThirtyDays: { total: 0, count: 0 },
      allTime: { total: 0, count: 0 },
      monthly: { donors: 0 },
      recentActivity: { count: 0 },
      totalDonors: { count: 0 }
    };
  }
}
