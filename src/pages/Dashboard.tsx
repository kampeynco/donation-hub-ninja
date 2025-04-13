
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/Dashboard/StatCard";
import DonationsTable from "@/components/Dashboard/DonationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRecentDonations, fetchDonationStats } from "@/services/donations";
import { IconActivity, IconMoodDollar, IconHeartDollar } from "@tabler/icons-react";
import IntegrationsTab from "@/components/Account/IntegrationsTab";

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
            title="Total Prospects" 
            value={`${stats.totalDonors.count}`} 
            subtitle={`UNIQUE CONTACTS`} 
            className="bg-donor-blue shadow-sm hover:shadow-md transition-shadow text-white" 
            icon={<IconMoodDollar className="h-6 w-6" />} 
          />
          <StatCard 
            title="Total Funds Raised" 
            value={`$${stats.allTime.total.toLocaleString()}`} 
            subtitle={`ACROSS ALL DONATIONS`} 
            className="bg-gray-700 shadow-sm hover:shadow-md transition-shadow text-white" 
            icon={<IconHeartDollar className="h-6 w-6" />} 
          />
        </div>
      </div>

      {/* Donations Table */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Recent Donations</h2>
        <DonationsTable donations={donations} />
      </div>

      {/* Connections Section */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Sources</h2>
        <IntegrationsTab />
      </div>
    </div>
  );
};

export default Dashboard;
