
import { Donation } from "@/types/donation";

interface TrendDataPoint {
  name: string;
  amount: number;
}

/**
 * Generate daily trend data from donations
 */
export function generateDailyTrend(donations: Donation[], days: number = 30): TrendDataPoint[] {
  if (!donations.length) return [];
  
  // Create a map to hold the total amount for each date
  const dailyTotals = new Map<string, number>();
  
  // Get the date range
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);
  
  // Initialize all dates in our range with zero
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = formatDate(date);
    dailyTotals.set(dateKey, 0);
  }
  
  // Sum the donation amounts by date
  donations.forEach(donation => {
    const donationDate = new Date(donation.date);
    // Only include donations within our date range
    if (donationDate >= startDate && donationDate <= today) {
      const dateKey = formatDate(donationDate);
      const currentAmount = dailyTotals.get(dateKey) || 0;
      dailyTotals.set(dateKey, currentAmount + donation.amount);
    }
  });
  
  // Convert to the format needed for the chart
  const trendData: TrendDataPoint[] = Array.from(dailyTotals.entries())
    .map(([date, amount]) => ({
      name: date,
      amount: amount
    }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  
  return trendData;
}

/**
 * Generate monthly trend data from donations
 */
export function generateMonthlyTrend(donations: Donation[], months: number = 6): TrendDataPoint[] {
  if (!donations.length) return [];
  
  // Create a map to hold the total amount for each month
  const monthlyTotals = new Map<string, number>();
  
  // Get the date range
  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - months + 1);
  startDate.setDate(1); // Start at the beginning of the month
  
  // Initialize all months in our range with zero
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const monthKey = formatMonth(date);
    monthlyTotals.set(monthKey, 0);
  }
  
  // Sum the donation amounts by month
  donations.forEach(donation => {
    const donationDate = new Date(donation.date);
    // Only include donations within our date range
    if (donationDate >= startDate && donationDate <= today) {
      const monthKey = formatMonth(donationDate);
      const currentAmount = monthlyTotals.get(monthKey) || 0;
      monthlyTotals.set(monthKey, currentAmount + donation.amount);
    }
  });
  
  // Convert to the format needed for the chart
  const trendData: TrendDataPoint[] = Array.from(monthlyTotals.entries())
    .map(([month, amount]) => ({
      name: month,
      amount: amount
    }))
    .sort((a, b) => {
      // Sort by year and month
      const [aMonth, aYear] = a.name.split(' ');
      const [bMonth, bYear] = b.name.split(' ');
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
    });
  
  return trendData;
}

// Helper function to format date as "MMM D"
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to format month as "MMM YYYY"
function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

// Re-export from stats directory
export * from './stats';
