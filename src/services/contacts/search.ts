
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";

/**
 * Searches for contacts by name, email, or phone
 */
export async function searchContacts(query: string, limit: number = 10) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    // Get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      console.error('Error fetching user contacts:', userContactsError);
      return [];
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    if (contactIds.length === 0) {
      return [];
    }

    // Create search query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search in contacts table
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        status,
        emails!left (
          id,
          email,
          is_primary
        ),
        phones!left (
          id,
          phone,
          is_primary
        )
      `)
      .in('id', contactIds)
      .or(`first_name.ilike.%${normalizedQuery}%,last_name.ilike.%${normalizedQuery}%`)
      .limit(limit);

    if (contactsError) {
      console.error('Error searching contacts by name:', contactsError);
      return [];
    }

    // Search in emails table
    const { data: emailMatches, error: emailError } = await supabase
      .from('emails')
      .select(`
        contact:contact_id (
          id,
          first_name,
          last_name,
          status,
          emails!left (
            id,
            email,
            is_primary
          ),
          phones!left (
            id,
            phone,
            is_primary
          )
        )
      `)
      .ilike('email', `%${normalizedQuery}%`)
      .in('contact_id', contactIds)
      .limit(limit);

    if (emailError) {
      console.error('Error searching contacts by email:', emailError);
      return [];
    }

    // Search in phones table
    const { data: phoneMatches, error: phoneError } = await supabase
      .from('phones')
      .select(`
        contact:contact_id (
          id,
          first_name,
          last_name,
          status,
          emails!left (
            id,
            email,
            is_primary
          ),
          phones!left (
            id,
            phone,
            is_primary
          )
        )
      `)
      .ilike('phone', `%${normalizedQuery}%`)
      .in('contact_id', contactIds)
      .limit(limit);

    if (phoneError) {
      console.error('Error searching contacts by phone:', phoneError);
      return [];
    }

    // Combine results and remove duplicates
    const combinedResults = [
      ...(contacts || []),
      ...(emailMatches?.map(match => match.contact) || []),
      ...(phoneMatches?.map(match => match.contact) || [])
    ];

    // Remove duplicates by ID
    const uniqueResults = Array.from(
      new Map(combinedResults.map(item => [item.id, item])).values()
    );

    return uniqueResults.slice(0, limit);
  } catch (error) {
    console.error('Error in searchContacts:', error);
    return [];
  }
}
