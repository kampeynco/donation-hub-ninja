
import { supabase } from "@/integrations/supabase/client";
import { Donation, DonationStats } from "@/types/donation";
import { toast } from "@/components/ui/use-toast";

export async function fetchRecentDonations(limit = 30): Promise<Donation[]> {
  try {
    // Modified query to correctly join with emails and avoid the relationship error
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        paid_at,
        donors:donor_id (
          id,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Get emails separately since there's no direct relationship between donations and emails
    const donoEmails = new Map();
    for (const donation of data) {
      if (donation.donors && donation.donors.id) {
        const { data: emailData } = await supabase
          .from('emails')
          .select('email')
          .eq('donor_id', donation.donors.id)
          .limit(1);
          
        if (emailData && emailData.length > 0) {
          donoEmails.set(donation.donors.id, emailData[0].email);
        }
      }
    }

    // Transform the data to match our Donation type
    return data.map((item: any) => ({
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
    }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    toast({
      title: "Error fetching donations",
      description: "Could not load donation data",
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchDonationStats(): Promise<DonationStats> {
  try {
    // Default stats in case of error
    const defaultStats: DonationStats = {
      lastThirtyDays: { total: 0, count: 0 },
      allTime: { total: 0, count: 0 },
      monthly: { donors: 0 }
    };

    // Last 30 days stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: last30DaysData, error: last30DaysError } = await supabase
      .from('donations')
      .select('amount')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (last30DaysError) throw last30DaysError;
    
    // All time stats
    const { data: allTimeData, error: allTimeError } = await supabase
      .from('donations')
      .select('amount');
    
    if (allTimeError) throw allTimeError;
    
    // Monthly donors count
    const { count: monthlyDonorsCount, error: monthlyError } = await supabase
      .from('donations')
      .select('donor_id', { count: 'exact', head: true })
      .not('recurring_period', 'eq', 'once');
    
    if (monthlyError) throw monthlyError;
    
    // Calculate totals
    const last30DaysTotal = last30DaysData.reduce((sum, item) => sum + Number(item.amount), 0);
    const allTimeTotal = allTimeData.reduce((sum, item) => sum + Number(item.amount), 0);
    
    return {
      lastThirtyDays: {
        total: last30DaysTotal,
        count: last30DaysData.length
      },
      allTime: {
        total: allTimeTotal,
        count: allTimeData.length
      },
      monthly: {
        donors: monthlyDonorsCount || 0
      }
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    toast({
      title: "Error fetching statistics",
      description: "Could not load donation statistics",
      variant: "destructive"
    });
    return {
      lastThirtyDays: { total: 0, count: 0 },
      allTime: { total: 0, count: 0 },
      monthly: { donors: 0 }
    };
  }
}
