
import { useEffect, useState } from "react";
import { Donation, DonationStats } from "@/types/donation";
import { generateMockDonations, calculateDonationStats } from "@/services/mockData";
import StatCard from "@/components/Dashboard/StatCard";
import DonationsTable from "@/components/Dashboard/DonationsTable";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Last 30 Days"
          value={`$${stats.lastThirtyDays.total.toLocaleString()}`}
          subtitle={`${stats.lastThirtyDays.count} DONATIONS`}
          className="bg-donor-green"
        />
        <StatCard
          title="Total Donations"
          value={`$${stats.allTime.total.toLocaleString()}`}
          subtitle={`${stats.allTime.count} DONATIONS`}
          className="bg-donor-blue"
        />
        <StatCard
          title="Monthly Donations"
          value={`$${Math.round(stats.lastThirtyDays.total / 30 * 30).toLocaleString()}`}
          subtitle={`${stats.monthly.donors} MONTHLY DONORS`}
          className="bg-gray-400"
        />
      </div>

      <DonationsTable donations={donations} />
    </div>
  );
};

export default Dashboard;
