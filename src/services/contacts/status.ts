
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";

/**
 * Updates a contact's status
 */
export async function updateContactStatus(contactId: string, status: 'prospect' | 'active' | 'donor') {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    // Check if contact belongs to the current user
    const { data: userContact, error: userContactError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .maybeSingle();
    
    if (userContactError || !userContact) {
      console.error('Error fetching user contact or contact not found:', userContactError);
      return false;
    }

    // Update the contact status
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', contactId);

    if (error) {
      console.error('Error updating contact status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateContactStatus:', error);
    return false;
  }
}

/**
 * Gets the count of contacts by status
 */
export async function getContactCountsByStatus() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { prospect: 0, active: 0, donor: 0, total: 0 };

    // Get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      console.error('Error fetching user contacts:', userContactsError);
      return { prospect: 0, active: 0, donor: 0, total: 0 };
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    if (contactIds.length === 0) {
      return { prospect: 0, active: 0, donor: 0, total: 0 };
    }

    // Build query to count by status
    const { data, error } = await supabase
      .from('contacts')
      .select('status, count')
      .in('id', contactIds)
      .group('status');

    if (error) {
      console.error('Error counting contacts by status:', error);
      return { prospect: 0, active: 0, donor: 0, total: 0 };
    }

    // Process results
    const result = { prospect: 0, active: 0, donor: 0, total: 0 };
    let total = 0;

    data?.forEach(item => {
      const count = typeof item.count === 'number' ? item.count : 0;
      switch (item.status) {
        case 'prospect':
          result.prospect = count;
          break;
        case 'active':
          result.active = count;
          break;
        case 'donor':
          result.donor = count;
          break;
      }
      total += count;
    });

    result.total = total;
    return result;
  } catch (error) {
    console.error('Error in getContactCountsByStatus:', error);
    return { prospect: 0, active: 0, donor: 0, total: 0 };
  }
}

/**
 * Gets the count of contacts with donations in the last 30 days
 */
export async function getRecentDonorCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return 0;

    // Get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      console.error('Error fetching user contacts:', userContactsError);
      return 0;
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    if (contactIds.length === 0) {
      return 0;
    }

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Count unique donors with recent donations
    const { count, error } = await supabase
      .from('donations')
      .select('contact_id', { count: 'exact', head: true, distinct: true })
      .in('contact_id', contactIds)
      .gte('paid_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error counting recent donors:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getRecentDonorCount:', error);
    return 0;
  }
}
