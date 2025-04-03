
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/Dashboard/StatCard";
import DonationsTable from "@/components/Dashboard/DonationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRecentDonations, fetchDonationStats } from "@/services/donations";
import { IconActivity, IconUsers, IconDollarSign } from "@tabler/icons-react";

const Dashboard = () => {
  const {
    data: donations = [],
    isLoading: isDonationsLoading
  } = useQuery({
    queryKey: ['donations'],
    queryFn: () => fetchRecentDonations(30)
  });
  const {
    data: stats,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ['donationStats'],
    queryFn: fetchDonationStats
  });

  if (isStatsLoading || isDonationsLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!stats) {
    return <div className="flex justify-center p-8">Failed to load donation statistics</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Account Overview</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard 
            title="New Activities" 
            value={`${stats.recentActivity.count}`} 
            subtitle={`LAST 24 HOURS`} 
            className="bg-donor-green shadow-sm hover:shadow-md transition-shadow text-white"
            icon={<IconActivity className="h-6 w-6" />}
          />
          <StatCard 
            title="Total Donors" 
            value={`${stats.totalDonors.count}`} 
            subtitle={`UNIQUE DONORS`} 
            className="bg-donor-blue shadow-sm hover:shadow-md transition-shadow text-white"
            icon={<IconUsers className="h-6 w-6" />}
          />
          <StatCard 
            title="Total Funds Raised" 
            value={`$${stats.allTime.total.toLocaleString()}`} 
            subtitle={`ACROSS ALL DONATIONS`} 
            className="bg-gray-700 shadow-sm hover:shadow-md transition-shadow text-white"
            icon={<IconDollarSign className="h-6 w-6" />}
          />
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 px-6 py-5 border-b dark:border-gray-700">
          <CardTitle className="text-lg font-medium">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DonationsTable donations={donations} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
