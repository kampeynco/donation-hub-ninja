
export interface Donation {
  id: string;
  date: string;
  name: string | null;
  email: string | null;
  amount: number;
  recurringPeriod?: string;
  recurringDuration?: number;
}

export interface DonationStats {
  lastThirtyDays: {
    total: number;
    count: number;
  };
  allTime: {
    total: number;
    count: number;
  };
  monthly: {
    donors: number;
  };
  recentActivity: {
    count: number;
  };
  totalDonors: {
    count: number;
  };
}
