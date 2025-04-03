
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
 * Helper function to fetch donor emails in a single batch
 * Optimized to use a single query and caching
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
    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return donoEmails;
    }

    // Fetch user's donor associations in a single query
    const { data: userDonors, error: userDonorsError } = await supabase
      .from('user_donors')
      .select('donor_id')
      .eq('user_id', userId)
      .in('donor_id', donorIds); // Only fetch the donors we need
    
    if (userDonorsError) {
      console.error('Error fetching user donors:', userDonorsError);
      return donoEmails;
    }
    
    // Extract valid donor IDs as an array
    const validDonorIds = userDonors?.map(ud => ud.donor_id) || [];
    
    if (validDonorIds.length === 0) {
      return donoEmails;
    }

    // Fetch all emails in a single query
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
    console.error('Error in batch email fetch:', error);
  }
  
  return donoEmails;
}

/**
 * Helper function to get the current user ID with memoization
 * This reduces redundant auth calls
 */
let cachedUserId: string | null = null;
let userFetchPromise: Promise<string | null> | null = null;

export async function getCurrentUserId(): Promise<string | null> {
  // Return cached value if available
  if (cachedUserId !== null) {
    return cachedUserId;
  }
  
  // If we're already fetching, return the existing promise
  if (userFetchPromise !== null) {
    return userFetchPromise;
  }
  
  // Create a new promise to fetch the user
  userFetchPromise = new Promise(async (resolve) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      cachedUserId = user?.id || null;
      resolve(cachedUserId);
    } catch (error) {
      console.error('Error getting current user:', error);
      resolve(null);
    } finally {
      // Clear the promise so we can fetch again if needed
      setTimeout(() => {
        userFetchPromise = null;
      }, 0);
    }
  });
  
  return userFetchPromise;
}

/**
 * Function to clear the user ID cache
 * Call this after logout or when user state changes
 */
export function clearUserCache(): void {
  cachedUserId = null;
  userFetchPromise = null;
}

/**
 * Function to handle errors in donation service
 */
export function handleDonationError(error: any, message: string) {
  console.error(`${message}:`, error);
  toast({
    title: message,
    description: "Could not load donation data. Please try again later.",
    variant: "destructive"
  });
}
