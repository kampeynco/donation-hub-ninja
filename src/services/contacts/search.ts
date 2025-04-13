
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { Contact } from "@/types/contact";

/**
 * Search contacts by name, email, or phone
 */
export async function searchContacts(searchTerm: string, limit = 10): Promise<Contact[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    // Get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError || !userContacts) {
      console.error('Error fetching user contacts:', userContactsError);
      return [];
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts.map(uc => uc.contact_id);
    
    if (contactIds.length === 0) {
      return [];
    }

    // Search contacts by name, joined with emails and phones
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*),
        donations(*),
        employer_data(*)
      `)
      .in('id', contactIds)
      .or(`
        first_name.ilike.%${searchTerm}%,
        last_name.ilike.%${searchTerm}%,
        emails.email.ilike.%${searchTerm}%,
        phones.phone.ilike.%${searchTerm}%
      `)
      .limit(limit);

    if (error) {
      console.error('Error searching contacts:', error);
      return [];
    }

    return data as Contact[];
  } catch (error) {
    console.error('Error in searchContacts:', error);
    return [];
  }
}
