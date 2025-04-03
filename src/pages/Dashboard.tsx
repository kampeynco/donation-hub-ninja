
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import StatCard from "@/components/Dashboard/StatCard";
import CounterCard from "@/components/Dashboard/CounterCard";
import StatCardSkeleton from "@/components/Dashboard/StatCardSkeleton";
import DonationsTable from "@/components/Dashboard/DonationsTable";
import DonationsTableSkeleton from "@/components/Dashboard/DonationsTableSkeleton";
import DonationsSummaryChart from "@/components/Dashboard/DonationsSummaryChart";
import RefreshButton from "@/components/Dashboard/RefreshButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchRecentDonations, fetchDonationStats, clearDonationsCache, generateMonthlyTrend } from "@/services/donations";
import { IconActivity, IconMoodDollar, IconHeartDollar, IconAnalyze } from "@tabler/icons-react";
import { toast } from "@/components/ui/use-toast";
import { Donation } from "@/types/donation";

const Dashboard = () => {
  // State for active chart time period
  const [activePeriod, setActivePeriod] = useState<string>("30days");
  
  // Fetch donation data
  const {
    data: donations = [],
    isLoading: isDonationsLoading,
    error: donationsError,
    refetch: refetchDonations
  } = useQuery({
    queryKey: ['donations'],
    queryFn: () => fetchRecentDonations(100), // Fetch more for chart
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  // Fetch donation stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['donationStats'],
    queryFn: fetchDonationStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Calculate chart data based on donations
  const monthlyTrendData = useMemo(() => {
    return generateMonthlyTrend(donations, 6);
  }, [donations]);
  
  // Handle errors
  if (donationsError) {
    toast({
      title: "Error loading donations",
      description: "There was a problem fetching your recent donations data.",
      variant: "destructive"
    });
  }
  
  if (statsError) {
    toast({
      title: "Error loading statistics",
      description: "There was a problem fetching your donation statistics.",
      variant: "destructive"
    });
  }

  // Empty stats fallback
  const emptyStats = {
    recentActivity: { count: 0 },
    totalDonors: { count: 0 },
    allTime: { total: 0, count: 0 },
    monthly: { donors: 0 },
    lastThirtyDays: { total: 0, count: 0 }
  };

  // Use stats data or empty object if not loaded
  const displayStats = stats || emptyStats;
  
  // Refresh all dashboard data
  const refreshDashboard = useCallback(async () => {
    // Clear cache to force fresh data
    clearDonationsCache();
    
    try {
      await Promise.all([
        refetchDonations(),
        refetchStats()
      ]);
      
      toast({
        title: "Dashboard refreshed",
        description: "Your dashboard has been updated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was a problem updating your dashboard.",
        variant: "destructive"
      });
    }
  }, [refetchDonations, refetchStats]);
  
  // Calculate the average donation amount
  const averageDonation = useMemo(() => {
    if (!displayStats.allTime.count || !displayStats.allTime.total) return 0;
    return displayStats.allTime.total / displayStats.allTime.count;
  }, [displayStats.allTime]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Account Overview</h1>
        <RefreshButton onRefresh={refreshDashboard} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isStatsLoading ? (
          // Show skeleton loading state for stats cards
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          // Show actual stats cards when data is loaded
          <>
            <CounterCard 
              title="New Activities" 
              value={displayStats.recentActivity.count}
              subtitle="LAST 24 HOURS" 
              className="bg-donor-green shadow-sm hover:shadow-md transition-shadow text-white"
              icon={<IconActivity className="h-6 w-6" />}
            />
            <CounterCard 
              title="Total Donors" 
              value={displayStats.totalDonors.count}
              subtitle="UNIQUE DONORS" 
              className="bg-donor-blue shadow-sm hover:shadow-md transition-shadow text-white"
              icon={<IconMoodDollar className="h-6 w-6" />}
            />
            <CounterCard 
              title="Total Raised" 
              value={displayStats.allTime.total}
              subtitle="ALL DONATIONS" 
              className="bg-gray-700 shadow-sm hover:shadow-md transition-shadow text-white"
              prefix="$"
              icon={<IconHeartDollar className="h-6 w-6" />}
            />
            <CounterCard 
              title="Average Donation" 
              value={averageDonation}
              subtitle="PER DONOR" 
              className="bg-[#4A6FA5] shadow-sm hover:shadow-md transition-shadow text-white"
              prefix="$"
              icon={<IconAnalyze className="h-6 w-6" />}
            />
          </>
        )}
      </div>
      
      <DonationsSummaryChart 
        data={monthlyTrendData}
        isLoading={isDonationsLoading}
        title="Monthly Donation Trends"
      />

      <Card className="shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 px-6 py-5 border-b dark:border-gray-700 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isDonationsLoading ? (
            <DonationsTableSkeleton />
          ) : (
            <DonationsTable donations={donations.slice(0, 30)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
