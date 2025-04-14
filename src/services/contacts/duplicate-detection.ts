
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { Contact, Email, Phone, Location } from "@/types/contact";

/**
 * Calculate name similarity score (35% first name, 40% last name)
 */
export function calculateNameSimilarity(contact1: Contact, contact2: Contact): number {
  let score = 0;
  
  // First name similarity (35%)
  if (contact1.first_name && contact2.first_name) {
    // Exact match
    if (contact1.first_name.toLowerCase() === contact2.first_name.toLowerCase()) {
      score += 35;
    } 
    // Partial match (first letter matches)
    else if (
      contact1.first_name.toLowerCase()[0] === contact2.first_name.toLowerCase()[0] &&
      (contact1.first_name.length >= 2 || contact2.first_name.length >= 2)
    ) {
      score += 15;
    }
  }
  
  // Last name similarity (40%)
  if (contact1.last_name && contact2.last_name) {
    // Exact match
    if (contact1.last_name.toLowerCase() === contact2.last_name.toLowerCase()) {
      score += 40;
    }
    // Partial match (at least 3 characters and 70% similarity)
    else if (
      contact1.last_name.length >= 3 && 
      contact2.last_name.length >= 3 &&
      calculateStringSimilarity(contact1.last_name, contact2.last_name) > 0.7
    ) {
      score += 25;
    }
  }
  
  return score;
}

/**
 * Calculate contact info similarity score (15% email, 5% phone, 5% address)
 */
export function calculateContactInfoSimilarity(
  contact1: Contact, 
  contact2: Contact
): {
  totalScore: number;
  emailScore: number;
  phoneScore: number;
  addressScore: number;
} {
  let emailScore = 0;
  let phoneScore = 0;
  let addressScore = 0;
  
  // Email similarity (15%)
  if (contact1.emails?.length && contact2.emails?.length) {
    if (hasExactMatch(contact1.emails, contact2.emails, 'email')) {
      emailScore = 15;
    }
  }
  
  // Phone similarity (5%)
  if (contact1.phones?.length && contact2.phones?.length) {
    if (hasExactMatch(contact1.phones, contact2.phones, 'phone')) {
      phoneScore = 5;
    }
  }
  
  // Address similarity (5%)
  if (contact1.locations?.length && contact2.locations?.length) {
    // Address match based on zip code, or city + state
    const addressMatch = contact1.locations.some(loc1 => 
      contact2.locations?.some(loc2 => {
        // Match on ZIP code
        if (loc1.zip && loc2.zip && loc1.zip === loc2.zip) {
          return true;
        }
        
        // Match on city + state
        if (loc1.city && loc1.state && loc2.city && loc2.state) {
          return loc1.city.toLowerCase() === loc2.city.toLowerCase() &&
                 loc1.state.toLowerCase() === loc2.state.toLowerCase();
        }
        
        return false;
      })
    );
    
    if (addressMatch) {
      addressScore = 5;
    }
  }
  
  return {
    totalScore: emailScore + phoneScore + addressScore,
    emailScore,
    phoneScore,
    addressScore
  };
}

/**
 * Calculate composite confidence score
 */
export function calculateConfidenceScore(
  contact1: Contact, 
  contact2: Contact
): {
  confidenceScore: number;
  nameScore: number;
  emailScore: number;
  phoneScore: number;
  addressScore: number;
} {
  const nameScore = calculateNameSimilarity(contact1, contact2);
  
  const { 
    totalScore: contactInfoScore, 
    emailScore, 
    phoneScore, 
    addressScore 
  } = calculateContactInfoSimilarity(contact1, contact2);
  
  // Total confidence score (name 75% + contact info 25%)
  const confidenceScore = nameScore + contactInfoScore;
  
  return {
    confidenceScore,
    nameScore,
    emailScore,
    phoneScore,
    addressScore
  };
}

/**
 * Check if there's an exact match between two arrays of objects
 */
function hasExactMatch<T>(
  array1: T[], 
  array2: T[], 
  key: keyof T
): boolean {
  for (const item1 of array1) {
    for (const item2 of array2) {
      if (
        item1[key] && 
        item2[key] && 
        String(item1[key]).toLowerCase() === String(item2[key]).toLowerCase()
      ) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Calculate string similarity (0-1) using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return track[str2.length][str1.length];
}

/**
 * Find potential duplicates for a contact
 */
export async function findPotentialDuplicates(contact: Contact): Promise<Contact[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    
    // Fetch contacts that might be duplicates
    // This is a simplified version - a real implementation would use more sophisticated queries
    const { data: potentialDuplicates, error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*)
      `)
      .neq('id', contact.id);
      
    if (error || !potentialDuplicates) {
      console.error('Error fetching potential duplicates:', error);
      return [];
    }
    
    // Calculate confidence scores for each potential duplicate
    const duplicatesWithScores = potentialDuplicates.map((potentialDuplicate: Contact) => {
      const { 
        confidenceScore, 
        nameScore, 
        emailScore, 
        phoneScore, 
        addressScore 
      } = calculateConfidenceScore(contact, potentialDuplicate);
      
      return {
        ...potentialDuplicate,
        confidenceScore,
        nameScore,
        emailScore,
        phoneScore,
        addressScore
      };
    });
    
    // Filter duplicates with confidence score above threshold (50%)
    return duplicatesWithScores
      .filter(duplicate => duplicate.confidenceScore >= 50)
      .sort((a, b) => b.confidenceScore - a.confidenceScore);
  } catch (error) {
    console.error('Error in findPotentialDuplicates:', error);
    return [];
  }
}

/**
 * Save detected duplicates to database
 */
export async function saveDuplicateMatch(
  contact1Id: string, 
  contact2Id: string, 
  scores: {
    confidenceScore: number;
    nameScore: number;
    emailScore: number;
    phoneScore: number;
    addressScore: number;
  }
): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    
    // Check if this duplicate pair already exists
    const { data: existingDuplicate, error: checkError } = await supabase
      .from('duplicate_matches')
      .select('id')
      .or(`contact1_id.eq.${contact1Id},contact2_id.eq.${contact1Id}`)
      .or(`contact1_id.eq.${contact2Id},contact2_id.eq.${contact2Id}`)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing duplicate:', checkError);
      return false;
    }
    
    // If duplicate already exists, don't create a new one
    if (existingDuplicate) {
      return false;
    }
    
    // Order contact IDs alphabetically for consistency
    const [firstId, secondId] = [contact1Id, contact2Id].sort();
    
    // Insert the duplicate match into the database
    const { error } = await supabase
      .from('duplicate_matches')
      .insert({
        contact1_id: firstId,
        contact2_id: secondId,
        confidence_score: scores.confidenceScore,
        name_score: scores.nameScore,
        email_score: scores.emailScore,
        phone_score: scores.phoneScore,
        address_score: scores.addressScore,
        resolved: false
      });
    
    if (error) {
      console.error('Error saving duplicate match:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveDuplicateMatch:', error);
    return false;
  }
}

/**
 * Process a new contact for potential duplicates
 */
export async function processContactForDuplicates(contactId: string): Promise<boolean> {
  try {
    // Fetch the contact with related data
    const { data: contact, error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*)
      `)
      .eq('id', contactId)
      .single();
      
    if (error || !contact) {
      console.error('Error fetching contact for duplicate detection:', error);
      return false;
    }
    
    // Find potential duplicates
    const potentialDuplicates = await findPotentialDuplicates(contact);
    
    // Save all potential matches
    for (const duplicate of potentialDuplicates) {
      const { 
        confidenceScore, 
        nameScore, 
        emailScore, 
        phoneScore, 
        addressScore 
      } = calculateConfidenceScore(contact, duplicate);
      
      await saveDuplicateMatch(
        contact.id,
        duplicate.id,
        {
          confidenceScore,
          nameScore,
          emailScore,
          phoneScore,
          addressScore
        }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error in processContactForDuplicates:', error);
    return false;
  }
}

/**
 * Merge two contacts, keeping the primary contact and updating its data
 * with any unique information from the secondary contact
 */
export async function mergeContacts(
  primaryContactId: string,
  secondaryContactId: string
): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    
    // Fetch both contacts with all related data
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        *,
        emails(*),
        phones(*),
        locations(*),
        donations(*)
      `)
      .in('id', [primaryContactId, secondaryContactId]);
      
    if (error || !contacts || contacts.length !== 2) {
      console.error('Error fetching contacts for merge:', error);
      return false;
    }
    
    // Identify primary and secondary contacts
    const primaryContact = contacts.find(c => c.id === primaryContactId);
    const secondaryContact = contacts.find(c => c.id === secondaryContactId);
    
    if (!primaryContact || !secondaryContact) {
      console.error('Could not find both contacts for merge');
      return false;
    }
    
    // Begin transaction
    const { error: beginError } = await supabase.rpc('begin_transaction');
    if (beginError) {
      console.error('Error beginning transaction:', beginError);
      return false;
    }
    
    try {
      // 1. Update emails - move all secondary emails to primary contact
      for (const email of secondaryContact.emails || []) {
        const { error: updateEmailError } = await supabase
          .from('emails')
          .update({ contact_id: primaryContactId })
          .eq('id', email.id);
          
        if (updateEmailError) throw updateEmailError;
      }
      
      // 2. Update phones - move all secondary phones to primary contact
      for (const phone of secondaryContact.phones || []) {
        const { error: updatePhoneError } = await supabase
          .from('phones')
          .update({ contact_id: primaryContactId })
          .eq('id', phone.id);
          
        if (updatePhoneError) throw updatePhoneError;
      }
      
      // 3. Update locations - move all secondary locations to primary contact
      for (const location of secondaryContact.locations || []) {
        const { error: updateLocationError } = await supabase
          .from('locations')
          .update({ contact_id: primaryContactId })
          .eq('id', location.id);
          
        if (updateLocationError) throw updateLocationError;
      }
      
      // 4. Update donations - move all secondary donations to primary contact
      for (const donation of secondaryContact.donations || []) {
        const { error: updateDonationError } = await supabase
          .from('donations')
          .update({ contact_id: primaryContactId })
          .eq('id', donation.id);
          
        if (updateDonationError) throw updateDonationError;
      }
      
      // 5. Update employer data - move to primary contact
      const { error: updateEmployerError } = await supabase
        .from('employer_data')
        .update({ contact_id: primaryContactId })
        .eq('contact_id', secondaryContactId);
        
      if (updateEmployerError) throw updateEmployerError;
      
      // 6. Update duplicate_matches - resolve any matches involving either contact
      const { error: updateDuplicatesError } = await supabase
        .from('duplicate_matches')
        .update({ 
          resolved: true,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .or(`contact1_id.eq.${primaryContactId},contact2_id.eq.${primaryContactId}`)
        .or(`contact1_id.eq.${secondaryContactId},contact2_id.eq.${secondaryContactId}`);
        
      if (updateDuplicatesError) throw updateDuplicatesError;
      
      // 7. Update user_contacts references
      const { error: updateUserContactsError } = await supabase
        .from('user_contacts')
        .update({ contact_id: primaryContactId })
        .eq('contact_id', secondaryContactId);
        
      if (updateUserContactsError) throw updateUserContactsError;
      
      // 8. Record merge in history
      const { error: insertHistoryError } = await supabase
        .from('merge_history')
        .insert({
          primary_contact_id: primaryContactId,
          merged_contact_id: secondaryContactId,
          merged_by: userId,
          metadata: {
            primary_name: `${primaryContact.first_name || ''} ${primaryContact.last_name || ''}`.trim(),
            secondary_name: `${secondaryContact.first_name || ''} ${secondaryContact.last_name || ''}`.trim(),
            timestamp: new Date().toISOString()
          }
        });
        
      if (insertHistoryError) throw insertHistoryError;
      
      // 9. Delete the secondary contact
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', secondaryContactId);
        
      if (deleteError) throw deleteError;
      
      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;
      
      return true;
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction');
      console.error('Error during contact merge:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in mergeContacts:', error);
    return false;
  }
}
