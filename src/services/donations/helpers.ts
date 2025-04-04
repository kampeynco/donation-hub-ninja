
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Donation } from "@/types/donation";

/**
 * Helper function for formatting a donation
 */
export function formatDonation(item: any, donoEmails: Map<string, string>): Donation {
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
    amount: Number(item.amount),
    recurringPeriod: item.recurring_period || null,
    recurringDuration: item.recurring_duration !== undefined ? Number(item.recurring_duration) : undefined
  };
}

/**
 * Helper function to fetch donor emails
 * Optimized to use a single query instead of multiple queries in a loop
 * And now ensures we only get emails for donors associated with the current user
 */
export async function fetchDonorEmails(donations: any[]): Promise<Map<string, string>> {
  const donoEmails = new Map();
  
  // Extract unique donor IDs
  const donorIds = [...new Set(
    donations
      .filter(donation => donation.donors && donation.donors.id)
      .map(donation => donation.donors.id)
  )];
  
  if (donorIds.length === 0) {
    return donoEmails;
  }
  
  try {
    // Get current user ID to ensure we only fetch emails for donors associated with this user
    const userId = await getCurrentUserId();
    if (!userId) {
      return donoEmails;
    }

    // First get donor IDs associated with the current user
    const { data: userDonors, error: userDonorsError } = await supabase
      .from('user_donors')
      .select('donor_id')
      .eq('user_id', userId);
    
    if (userDonorsError) {
      console.error('Error fetching user donors:', userDonorsError);
      return donoEmails;
    }
    
    // Extract user's donor IDs as an array
    const userDonorIds = userDonors?.map(ud => ud.donor_id) || [];
    
    // Only proceed with donor IDs that belong to this user
    const validDonorIds = donorIds.filter(id => userDonorIds.includes(id));

    if (validDonorIds.length === 0) {
      return donoEmails;
    }

    // Fetch all emails with a single query, ensuring they belong to the current user's donors
    const { data: emailData, error } = await supabase
      .from('emails')
      .select('email, donor_id')
      .in('donor_id', validDonorIds);
      
    if (error) {
      console.error('Error fetching donor emails:', error);
      return donoEmails;
    }
      
    // Build the map from the results
    if (emailData && emailData.length > 0) {
      emailData.forEach(item => {
        donoEmails.set(item.donor_id, item.email);
      });
    }
  } catch (error) {
    console.error('Error in bulk email fetch:', error);
  }
  
  return donoEmails;
}

/**
 * Helper function to get the current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Function to handle errors in donation service
 */
export function handleDonationError(error: any, message: string) {
  console.error(`${message}:`, error);
  toast({
    title: message,
    description: "Could not load donation data",
    variant: "destructive"
  });
}
