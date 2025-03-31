
import { DonationStats } from "@/types/donation";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId, handleDonationError } from "./helpers";

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
    
    // Use user_donors junction table to ensure we only get donations for the current user
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .in('donor_id', function(builder) {
        builder
          .select('donor_id')
          .from('user_donors')
          .eq('user_id', userId);
      })
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

    // Use user_donors junction table to ensure we only get donations for the current user
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .in('donor_id', function(builder) {
        builder
          .select('donor_id')
          .from('user_donors')
          .eq('user_id', userId);
      });
    
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

    // Use user_donors junction table to ensure we only get donors for the current user
    const { count, error } = await supabase
      .from('donations')
      .select('donor_id', { count: 'exact', head: true })
      .in('donor_id', function(builder) {
        builder
          .select('donor_id')
          .from('user_donors')
          .eq('user_id', userId);
      })
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
    const [lastThirtyDays, allTime, monthlyDonorsCount] = await Promise.all([
      fetchLast30DaysStats(),
      fetchAllTimeStats(),
      fetchMonthlyDonorsCount()
    ]);
    
    return {
      lastThirtyDays,
      allTime,
      monthly: {
        donors: monthlyDonorsCount
      }
    };
  } catch (error) {
    handleDonationError(error, "Error fetching donation stats");
    return {
      lastThirtyDays: { total: 0, count: 0 },
      allTime: { total: 0, count: 0 },
      monthly: { donors: 0 }
    };
  }
}
