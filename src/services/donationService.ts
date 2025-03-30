
import { supabase } from "@/integrations/supabase/client";
import { Donation, DonationStats } from "@/types/donation";
import { toast } from "@/components/ui/use-toast";

// Helper function for formatting a donation
function formatDonation(item: any, donoEmails: Map<string, string>): Donation {
  return {
    id: item.id,
    date: new Date(item.paid_at || item.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    name: item.donors ? 
      `${item.donors.first_name || ''} ${item.donors.last_name || ''}`.trim() || 'Anonymous' 
      : 'Anonymous',
    email: item.donors ? donoEmails.get(item.donors.id) || null : null,
    amount: Number(item.amount)
  };
}

// Helper function to fetch donor emails
async function fetchDonorEmails(donations: any[]): Promise<Map<string, string>> {
  const donoEmails = new Map();
  
  for (const donation of donations) {
    if (donation.donors && donation.donors.id) {
      try {
        const { data: emailData, error } = await supabase
          .from('emails')
          .select('email')
          .eq('donor_id', donation.donors.id)
          .limit(1);
          
        if (error) {
          console.error('Error fetching donor email:', error);
          continue;
        }
          
        if (emailData && emailData.length > 0) {
          donoEmails.set(donation.donors.id, emailData[0].email);
        }
      } catch (error) {
        console.error('Error in email fetch for donor:', donation.donors.id, error);
      }
    }
  }
  
  return donoEmails;
}

// Helper function to get the current user ID
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Main function to fetch recent donations
export async function fetchRecentDonations(limit = 30): Promise<Donation[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning empty donations array');
      return [];
    }

    // Fetch donations with donor information
    // Thanks to RLS, this query will only return donations associated with the current user
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        paid_at,
        created_at,
        donors:donor_id (
          id,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Fetch emails for donors
    const donoEmails = await fetchDonorEmails(data || []);
    
    // Format donation data
    return (data || []).map((item: any) => formatDonation(item, donoEmails));
  } catch (error) {
    handleDonationError(error, "Error fetching donations");
    return [];
  }
}

// Function to handle errors in donation service
function handleDonationError(error: any, message: string) {
  console.error(`${message}:`, error);
  toast({
    title: message,
    description: "Could not load donation data",
    variant: "destructive"
  });
}

// Stats-related functions

// Helper function to fetch last 30 days stats
async function fetchLast30DaysStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { total: 0, count: 0 };
    }

    // Thanks to RLS, this query will only return donations associated with the current user
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
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

// Helper function to fetch all time stats
async function fetchAllTimeStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { total: 0, count: 0 };
    }

    // Thanks to RLS, this query will only return donations associated with the current user
    const { data, error } = await supabase
      .from('donations')
      .select('amount');
    
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

// Helper function to fetch monthly donors count
async function fetchMonthlyDonorsCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    // Thanks to RLS, this query will only return donations associated with the current user
    const { count, error } = await supabase
      .from('donations')
      .select('donor_id', { count: 'exact', head: true })
      .not('recurring_period', 'eq', 'once');
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching monthly donors count:', error);
    return 0;
  }
}

// Main function to fetch donation stats
export async function fetchDonationStats(): Promise<DonationStats> {
  try {
    // Default stats in case of error
    const defaultStats: DonationStats = {
      lastThirtyDays: { total: 0, count: 0 },
      allTime: { total: 0, count: 0 },
      monthly: { donors: 0 }
    };

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
