
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { DuplicateMatch, Contact } from "@/types/contact";

interface DuplicateFilters {
  page: number;
  limit: number;
  minConfidence: number;
}

interface DuplicateResult {
  data: DuplicateMatch[];
  count: number;
}

interface DuplicateContactsResult {
  contact1: Contact | null;
  contact2: Contact | null;
}

interface ResolveDuplicateParams {
  duplicateId: string;
  action: 'merge' | 'ignore';
  primaryContactId?: string;
}

/**
 * Fetch potential duplicate contacts
 */
export async function fetchDuplicates(filters: DuplicateFilters): Promise<DuplicateResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], count: 0 };

    // Calculate offset
    const { page, limit, minConfidence } = filters;
    const offset = (page - 1) * limit;

    // Get duplicate matches
    const { data, error, count } = await supabase
      .from('duplicate_matches')
      .select('*', { count: 'exact' })
      .gte('confidence_score', minConfidence)
      .eq('resolved', false)
      .order('confidence_score', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching duplicate matches:', error);
      return { data: [], count: 0 };
    }

    return { 
      data: data as DuplicateMatch[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in fetchDuplicates:', error);
    return { data: [], count: 0 };
  }
}

/**
 * Fetch details for both contacts in a duplicate match
 */
export async function fetchDuplicateContactsById(
  contact1Id: string, 
  contact2Id: string
): Promise<DuplicateContactsResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { contact1: null, contact2: null };

    // Fetch first contact details
    const { data: contact1Data, error: contact1Error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*),
        donations(*),
        employer_data(*)
      `)
      .eq('id', contact1Id)
      .single();

    if (contact1Error) {
      console.error('Error fetching contact 1:', contact1Error);
    }

    // Fetch second contact details
    const { data: contact2Data, error: contact2Error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*),
        donations(*),
        employer_data(*)
      `)
      .eq('id', contact2Id)
      .single();

    if (contact2Error) {
      console.error('Error fetching contact 2:', contact2Error);
    }

    return {
      contact1: contact1Data as Contact || null,
      contact2: contact2Data as Contact || null
    };
  } catch (error) {
    console.error('Error in fetchDuplicateContactsById:', error);
    return { contact1: null, contact2: null };
  }
}

/**
 * Resolve a duplicate match (merge or ignore)
 */
export async function resolveDuplicateMatch(params: ResolveDuplicateParams): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { duplicateId, action, primaryContactId } = params;

    if (action === 'ignore') {
      // Mark as resolved without merging
      const { error } = await supabase
        .from('duplicate_matches')
        .update({
          resolved: true,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', duplicateId);

      if (error) {
        console.error('Error ignoring duplicate:', error);
        return false;
      }

      return true;
    } 
    else if (action === 'merge' && primaryContactId) {
      // Get the duplicate match details to know both contact IDs
      const { data: duplicate, error: matchError } = await supabase
        .from('duplicate_matches')
        .select('contact1_id, contact2_id')
        .eq('id', duplicateId)
        .single();

      if (matchError || !duplicate) {
        console.error('Error fetching duplicate match:', matchError);
        return false;
      }

      // Determine the secondary contact ID (the one to merge from)
      const secondaryContactId = duplicate.contact1_id === primaryContactId 
        ? duplicate.contact2_id 
        : duplicate.contact1_id;

      // Call server function to handle the merge (simplified for now)
      // This would typically call a server function that handles the complex merge logic
      
      // For now, we'll just mark it as resolved
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

      // Record the merge in history
      const { error: historyError } = await supabase
        .from('merge_history')
        .insert([{
          primary_contact_id: primaryContactId,
          merged_contact_id: secondaryContactId,
          merged_by: userId
        }]);

      if (historyError) {
        console.error('Error recording merge history:', historyError);
        // Don't return false here, as the main operation succeeded
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in resolveDuplicateMatch:', error);
    return false;
  }
}
