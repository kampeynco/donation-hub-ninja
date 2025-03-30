
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
 */
export async function fetchDonorEmails(donations: any[]): Promise<Map<string, string>> {
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
