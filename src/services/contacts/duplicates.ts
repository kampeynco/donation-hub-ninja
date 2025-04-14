import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { DuplicateMatch, Contact } from "@/types/contact";
import { 
  calculateNameScore, 
  calculateEmailScore, 
  calculatePhoneScore,
  calculateAddressScore,
  calculateConfidenceScore,
  extractEmailAddresses,
  extractPhoneNumbers,
  extractAddresses
} from "@/utils/duplicateDetection";

interface DuplicateFilters {
  page: number;
  limit: number;
  minConfidence: number;
  sortOrder?: 'asc' | 'desc';
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
    const { page, limit, minConfidence, sortOrder = 'desc' } = filters;
    const offset = (page - 1) * limit;

    // Get duplicate matches
    const { data, error, count } = await supabase
      .from('duplicate_matches')
      .select('*', { count: 'exact' })
      .gte('confidence_score', minConfidence)
      .eq('resolved', false)
      .order('confidence_score', { ascending: sortOrder === 'asc' })
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

/**
 * Run a scan for potential duplicate contacts for a user
 * This should be run periodically or when new contacts are added
 */
export async function scanForDuplicates(): Promise<number> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return 0;

    // Get all contacts for the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError || !userContacts?.length) {
      console.error('Error fetching user contacts:', userContactsError);
      return 0;
    }

    const contactIds = userContacts.map(uc => uc.contact_id);
    
    // Fetch full contact details for comparison
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        emails(id, email),
        phones(id, phone),
        locations(id, street, city, state, zip)
      `)
      .in('id', contactIds);
    
    if (contactsError || !contacts) {
      console.error('Error fetching contacts for comparison:', contactsError);
      return 0;
    }

    // Track new duplicates found
    let duplicatesFound = 0;

    // Compare each contact with every other contact
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const contact1 = contacts[i];
        const contact2 = contacts[j];
        
        // Calculate component scores
        const nameScore = calculateNameScore(
          contact1.first_name, 
          contact1.last_name, 
          contact2.first_name, 
          contact2.last_name
        );
        
        const emailScore = calculateEmailScore(
          extractEmailAddresses(contact1.emails), 
          extractEmailAddresses(contact2.emails)
        );
        
        const phoneScore = calculatePhoneScore(
          extractPhoneNumbers(contact1.phones), 
          extractPhoneNumbers(contact2.phones)
        );
        
        const addressScore = calculateAddressScore(
          extractAddresses(contact1.locations), 
          extractAddresses(contact2.locations)
        );
        
        // Calculate composite confidence score
        const confidenceScore = calculateConfidenceScore(
          nameScore,
          emailScore,
          phoneScore,
          addressScore
        );
        
        // Only store matches above 50% confidence
        if (confidenceScore >= 50) {
          // Check if this pair already exists in duplicate_matches
          const { data: existingMatch } = await supabase
            .from('duplicate_matches')
            .select('id')
            .or(`contact1_id.eq.${contact1.id},contact2_id.eq.${contact1.id}`)
            .or(`contact1_id.eq.${contact2.id},contact2_id.eq.${contact2.id}`)
            .eq('resolved', false)
            .maybeSingle();
          
          if (!existingMatch) {
            // Insert as a new potential duplicate
            const { error: insertError } = await supabase
              .from('duplicate_matches')
              .insert([{
                contact1_id: contact1.id,
                contact2_id: contact2.id,
                confidence_score: confidenceScore,
                name_score: nameScore,
                email_score: emailScore,
                phone_score: phoneScore,
                address_score: addressScore,
                resolved: false
              }]);
            
            if (!insertError) {
              duplicatesFound++;
            } else {
              console.error('Error inserting duplicate match:', insertError);
            }
          }
        }
      }
    }
    
    return duplicatesFound;
  } catch (error) {
    console.error('Error in scanForDuplicates:', error);
    return 0;
  }
}

/**
 * Find potential matches for a new contact
 * Returns the best match if confidence is above threshold
 */
export async function findMatchingContact(
  newContactData: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
    phone?: string;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  },
  minConfidence = 90
): Promise<{contact: Contact | null, confidenceScore: number}> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { contact: null, confidenceScore: 0 };

    // Get all contacts for the current user
    const { data: userContacts, error: userContactsError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId);
    
    if (userContactsError || !userContacts?.length) {
      return { contact: null, confidenceScore: 0 };
    }

    const contactIds = userContacts.map(uc => uc.contact_id);
    
    // Fetch full contact details for comparison
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(id, email, is_primary, type, verified),
        phones(id, phone, is_primary, type, verified),
        locations(id, street, city, state, zip, country, is_primary, type),
        donations(*)
      `)
      .in('id', contactIds);
    
    if (contactsError || !contacts?.length) {
      return { contact: null, confidenceScore: 0 };
    }

    let bestMatch: Contact | null = null;
    let highestConfidence = 0;
    
    // Extract emails and phones for quick comparison
    const newEmailAddress = newContactData.email ? [newContactData.email] : [];
    const newPhoneNumber = newContactData.phone ? [newContactData.phone] : [];
    const newAddress = (newContactData.city || newContactData.state || newContactData.zip) ? 
      [{
        street: null,
        city: newContactData.city,
        state: newContactData.state,
        zip: newContactData.zip
      }] : [];

    // Compare with each existing contact
    for (const contact of contacts) {
      // Ensure contact data matches our expected types
      const typedContact = {
        ...contact,
        emails: contact.emails?.map(email => ({
          id: email.id,
          email: email.email,
          type: email.type || 'personal',
          is_primary: email.is_primary,
          verified: email.verified || false
        })),
        phones: contact.phones?.map(phone => ({
          id: phone.id,
          phone: phone.phone,
          type: phone.type || 'mobile',
          is_primary: phone.is_primary,
          verified: phone.verified || false
        })),
        locations: contact.locations?.map(location => ({
          id: location.id,
          street: location.street,
          city: location.city,
          state: location.state,
          zip: location.zip,
          country: location.country,
          type: location.type || 'main',
          is_primary: location.is_primary
        }))
      } as Contact;

      // Calculate component scores
      const nameScore = calculateNameScore(
        newContactData.first_name || null,
        newContactData.last_name || null,
        typedContact.first_name,
        typedContact.last_name
      );
      
      const emailScore = calculateEmailScore(
        newEmailAddress,
        extractEmailAddresses(typedContact.emails)
      );
      
      const phoneScore = calculatePhoneScore(
        newPhoneNumber,
        extractPhoneNumbers(typedContact.phones)
      );
      
      const addressScore = calculateAddressScore(
        newAddress,
        extractAddresses(typedContact.locations)
      );
      
      // Calculate composite confidence score
      const confidenceScore = calculateConfidenceScore(
        nameScore,
        emailScore,
        phoneScore,
        addressScore
      );
      
      // Update best match if confidence is higher
      if (confidenceScore > highestConfidence) {
        highestConfidence = confidenceScore;
        bestMatch = typedContact;
      }
    }
    
    // Only return matches that meet minimum confidence
    if (highestConfidence >= minConfidence) {
      // Exact match on a primary identifier is required for high confidence
      if (bestMatch && (
        hasPrimaryMatch(newEmailAddress, bestMatch.emails) || 
        hasPrimaryMatch(newPhoneNumber, bestMatch.phones)
      )) {
        return { contact: bestMatch, confidenceScore: highestConfidence };
      }
    }
    
    return { contact: null, confidenceScore: 0 };
  } catch (error) {
    console.error('Error in findMatchingContact:', error);
    return { contact: null, confidenceScore: 0 };
  }
}

/**
 * Helper to check if there's an exact match on a primary identifier
 */
function hasPrimaryMatch(
  newValues: string[], 
  existingValues?: Array<{ is_primary?: boolean, email?: string, phone?: string } | null>
): boolean {
  if (!newValues.length || !existingValues?.length) return false;
  
  for (const val of newValues) {
    for (const existing of existingValues) {
      if (!existing) continue;
      
      if (existing.is_primary) {
        // Check if this is an email match
        if (existing.email && existing.email.toLowerCase() === val.toLowerCase()) {
          return true;
        }
        
        // Check if this is a phone match
        if (existing.phone) {
          const normalizedNew = val.replace(/\D/g, '');
          const normalizedExisting = existing.phone.replace(/\D/g, '');
          
          if (normalizedNew.length >= 7 && normalizedExisting.length >= 7) {
            if (normalizedNew.slice(-7) === normalizedExisting.slice(-7)) {
              return true;
            }
          }
        }
      }
    }
  }
  
  return false;
}
