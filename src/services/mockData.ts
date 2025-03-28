
import { Donation, DonationStats } from "@/types/donation";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample donors
const donors = [
  { name: "Jason Bourne", email: "jason@gmail.com" },
  { name: "Luke Skywalker", email: "luke@lucasarts.com" },
  { name: "Bror Jace", email: "bror@roguesquadron.com" },
  { name: "Kevin Flynn", email: "kevin@hotmail.com" },
  { name: null, email: null } // Anonymous
];

// Generate random date within the last 30 days
const generateDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return `May ${date.getDate()}, ${date.getFullYear()}`;
};

// Generate random amount
const generateAmount = () => {
  const amounts = [25, 50, 100, 125, 250, 500, 1000];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

// Generate mock donations
export const generateMockDonations = (count: number): Donation[] => {
  return Array.from({ length: count }, () => {
    const donor = donors[Math.floor(Math.random() * donors.length)];
    return {
      id: generateId(),
      date: generateDate(),
      name: donor.name,
      email: donor.email,
      amount: generateAmount()
    };
  });
};

// Calculate donation statistics
export const calculateDonationStats = (donations: Donation[]): DonationStats => {
  const lastThirtyDaysTotal = donations.reduce((acc, donation) => acc + donation.amount, 0);
  
  // For demo, we'll set all-time stats to be larger than 30-day stats
  const allTimeTotal = lastThirtyDaysTotal * 15;
  
  return {
    lastThirtyDays: {
      total: lastThirtyDaysTotal,
      count: donations.length
    },
    allTime: {
      total: allTimeTotal,
      count: donations.length * 15
    },
    monthly: {
      donors: 18 // Fixed for demo
    }
  };
};
