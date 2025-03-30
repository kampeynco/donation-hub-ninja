
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
    amount: Number(item.amount)
  };
}

/**
 * Helper function to fetch donor emails
 * Optimized to use a single query instead of multiple queries in a loop
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
    // Fetch all emails with a single query
    const { data: emailData, error } = await supabase
      .from('emails')
      .select('email, donor_id')
      .in('donor_id', donorIds);
      
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
