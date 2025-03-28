
import { useEffect, useState } from "react";
import { Donation, DonationStats } from "@/types/donation";
import { generateMockDonations, calculateDonationStats } from "@/services/mockData";
import StatCard from "@/components/Dashboard/StatCard";
import DonationsTable from "@/components/Dashboard/DonationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockDonations = generateMockDonations(30);
    setDonations(mockDonations);
    setStats(calculateDonationStats(mockDonations));
  }, []);

  if (!stats) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Donation Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            title="Last 30 Days"
            value={`$${stats.lastThirtyDays.total.toLocaleString()}`}
            subtitle={`${stats.lastThirtyDays.count} DONATIONS`}
            className="bg-donor-green shadow-sm hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Total Donations"
            value={`$${stats.allTime.total.toLocaleString()}`}
            subtitle={`${stats.allTime.count} DONATIONS`}
            className="bg-donor-blue shadow-sm hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Monthly Donations"
            value={`$${Math.round(stats.lastThirtyDays.total / 30 * 30).toLocaleString()}`}
            subtitle={`${stats.monthly.donors} MONTHLY DONORS`}
            className="bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-white px-6 py-5 border-b">
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
