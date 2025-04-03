
import { DonationStats } from "@/types/donation";
import { handleDonationError } from "../helpers";
import { fetchLastThirtyDaysStats } from "./last-thirty-days";
import { fetchAllTimeStats } from "./all-time";
import { fetchMonthlyDonorsCount } from "./monthly-donors";
import { fetchRecentActivityCount } from "./recent-activity";
import { fetchTotalDonorsCount } from "./total-donors";

/**
 * Main function to fetch donation stats
 */
export async function fetchDonationStats(): Promise<DonationStats> {
  try {
    // Fetch all stats in parallel for better performance
    const [lastThirtyDays, allTime, monthlyDonorsCount, recentActivityCount, totalDonorsCount] = await Promise.all([
      fetchLastThirtyDaysStats(),
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

// Re-export individual stat fetchers for direct use if needed
export { 
  fetchLastThirtyDaysStats,
  fetchAllTimeStats,
  fetchMonthlyDonorsCount,
  fetchRecentActivityCount,
  fetchTotalDonorsCount
};
