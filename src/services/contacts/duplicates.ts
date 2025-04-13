
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { DuplicateMatch } from "@/types/contact";

/**
 * Fetches duplicate matches for the current user
 */
export async function fetchDuplicateMatches(minConfidence = 75, page = 1, limit = 20) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], count: 0 };

    const startIndex = (page - 1) * limit;

    // Get contact IDs associated with the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError) {
      console.error('Error fetching user contacts:', userContactsError);
      return { data: [], count: 0 };
    }
    
    // Extract contact IDs as an array
    const contactIds = userContacts?.map(uc => uc.contact_id) || [];
    
    if (contactIds.length === 0) {
      return { data: [], count: 0 };
    }

    // First get the total count of duplicates
    const { count, error: countError } = await supabase
      .from('duplicate_matches')
      .select('id', { count: 'exact', head: true })
      .or(`contact1_id.in.(${contactIds.join(',')}),contact2_id.in.(${contactIds.join(',')})`)
      .gte('confidence_score', minConfidence)
      .eq('resolved', false);
    
    if (countError) {
      console.error('Error counting duplicate matches:', countError);
      return { data: [], count: 0 };
    }

    // Then fetch the paginated data
    const { data: duplicates, error: duplicatesError } = await supabase
      .from('duplicate_matches')
      .select(`
        id,
        contact1_id,
        contact2_id,
        confidence_score,
        name_score,
        email_score,
        phone_score,
        address_score,
        created_at,
        updated_at,
        resolved,
        reviewed_by,
        reviewed_at
      `)
      .or(`contact1_id.in.(${contactIds.join(',')}),contact2_id.in.(${contactIds.join(',')})`)
      .gte('confidence_score', minConfidence)
      .eq('resolved', false)
      .order('confidence_score', { ascending: false })
      .range(startIndex, startIndex + limit - 1);

    if (duplicatesError) {
      console.error('Error fetching duplicate matches:', duplicatesError);
      return { data: [], count: 0 };
    }

    return {
      data: duplicates as DuplicateMatch[] || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in fetchDuplicateMatches:', error);
    return { data: [], count: 0 };
  }
}

/**
 * Fetches contacts associated with a specific duplicate match
 */
export async function fetchDuplicateContacts(duplicateMatch: DuplicateMatch) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { contact1: null, contact2: null };

    const { contact1_id, contact2_id } = duplicateMatch;

    // Fetch first contact
    const { data: contact1, error: contact1Error } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        status,
        created_at,
        updated_at,
        emails (
          id,
          email,
          type,
          is_primary
        ),
        phones (
          id,
          phone,
          type,
          is_primary
        ),
        locations (
          id,
          street,
          city,
          state,
          zip,
          type,
          is_primary
        )
      `)
      .eq('id', contact1_id)
      .single();

    if (contact1Error) {
      console.error('Error fetching first contact for duplicate:', contact1Error);
      return { contact1: null, contact2: null };
    }

    // Fetch second contact
    const { data: contact2, error: contact2Error } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        status,
        created_at,
        updated_at,
        emails (
          id,
          email,
          type,
          is_primary
        ),
        phones (
          id,
          phone,
          type,
          is_primary
        ),
        locations (
          id,
          street,
          city,
          state,
          zip,
          type,
          is_primary
        )
      `)
      .eq('id', contact2_id)
      .single();

    if (contact2Error) {
      console.error('Error fetching second contact for duplicate:', contact2Error);
      return { contact1: null, contact2: null };
    }

    return { contact1, contact2 };
  } catch (error) {
    console.error('Error in fetchDuplicateContacts:', error);
    return { contact1: null, contact2: null };
  }
}

/**
 * Marks a duplicate match as resolved
 */
export async function resolveDuplicate(duplicateId: string, action: 'ignore' | 'merge', primaryContactId?: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    // Mark the duplicate as resolved
    const { error } = await supabase
      .from('duplicate_matches')
      .update({
        resolved: true,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', duplicateId);

    if (error) {
      console.error('Error resolving duplicate:', error);
      return false;
    }

    // If the action is to merge and we have a primary contact ID, we would handle the merge logic here
    if (action === 'merge' && primaryContactId) {
      // This would call a more complex merge function that we would implement separately
      // mergeContacts(duplicateId, primaryContactId);
    }

    return true;
  } catch (error) {
    console.error('Error in resolveDuplicate:', error);
    return false;
  }
}
