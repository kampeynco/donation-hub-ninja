
/**
 * Utility functions for calculating confidence scores and detecting duplicates
 */

/**
 * Calculate name similarity score (75% of total confidence)
 * - First name exact match: 35%
 * - Last name exact match: 40%
 * - Uses fuzzy matching for slight variations
 */
export function calculateNameScore(
  firstName1: string | null, 
  lastName1: string | null, 
  firstName2: string | null, 
  lastName2: string | null
): number {
  let score = 0;
  
  // First name comparison (35%)
  if (firstName1 && firstName2) {
    const normalizedFirst1 = firstName1.toLowerCase().trim();
    const normalizedFirst2 = firstName2.toLowerCase().trim();
    
    if (normalizedFirst1 === normalizedFirst2) {
      score += 35;
    } else if (fuzzyMatch(normalizedFirst1, normalizedFirst2)) {
      score += 25; // Partial match
    } else if (isNicknameMatch(normalizedFirst1, normalizedFirst2)) {
      score += 25; // Nickname match
    } else if (normalizedFirst1[0] === normalizedFirst2[0]) {
      score += 10; // First letter match
    }
  } else if (!firstName1 && !firstName2) {
    score += 10; // Both missing
  }
  
  // Last name comparison (40%)
  if (lastName1 && lastName2) {
    const normalizedLast1 = lastName1.toLowerCase().trim();
    const normalizedLast2 = lastName2.toLowerCase().trim();
    
    if (normalizedLast1 === normalizedLast2) {
      score += 40;
    } else if (fuzzyMatch(normalizedLast1, normalizedLast2)) {
      score += 30; // Partial match
    } else if (normalizedLast1[0] === normalizedLast2[0]) {
      score += 10; // First letter match
    }
  } else if (!lastName1 && !lastName2) {
    score += 10; // Both missing
  }
  
  return Math.min(score, 75); // Cap at 75%
}

/**
 * Calculate email match score (15% of total confidence)
 */
export function calculateEmailScore(emails1: string[], emails2: string[]): number {
  if (!emails1.length || !emails2.length) {
    return 0;
  }
  
  // Check for exact match
  for (const email1 of emails1) {
    for (const email2 of emails2) {
      if (email1.toLowerCase() === email2.toLowerCase()) {
        return 15; // Exact match
      }
    }
  }
  
  // Check for domain match
  for (const email1 of emails1) {
    const domain1 = email1.split('@')[1]?.toLowerCase();
    
    for (const email2 of emails2) {
      const domain2 = email2.split('@')[1]?.toLowerCase();
      
      if (domain1 && domain2 && domain1 === domain2) {
        return 5; // Same domain
      }
    }
  }
  
  return 0;
}

/**
 * Calculate phone match score (5% of total confidence)
 */
export function calculatePhoneScore(phones1: string[], phones2: string[]): number {
  if (!phones1.length || !phones2.length) {
    return 0;
  }
  
  // Normalize phone numbers (remove non-digits)
  const normalizedPhones1 = phones1.map(phone => phone.replace(/\D/g, ''));
  const normalizedPhones2 = phones2.map(phone => phone.replace(/\D/g, ''));
  
  // Check for exact match
  for (const phone1 of normalizedPhones1) {
    for (const phone2 of normalizedPhones2) {
      if (phone1.length >= 7 && phone2.length >= 7) {
        // Match on last 7 digits
        if (phone1.slice(-7) === phone2.slice(-7)) {
          return 5; // Exact match
        }
      }
    }
  }
  
  return 0;
}

/**
 * Calculate address match score (5% of total confidence)
 */
export function calculateAddressScore(
  addresses1: Array<{
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  }>,
  addresses2: Array<{
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  }>
): number {
  if (!addresses1.length || !addresses2.length) {
    return 0;
  }
  
  let maxScore = 0;
  
  for (const addr1 of addresses1) {
    for (const addr2 of addresses2) {
      let score = 0;
      
      // ZIP code match (most specific)
      if (addr1.zip && addr2.zip && addr1.zip === addr2.zip) {
        score += 2;
      }
      
      // State match
      if (addr1.state && addr2.state && addr1.state.toUpperCase() === addr2.state.toUpperCase()) {
        score += 1;
      }
      
      // City match
      if (addr1.city && addr2.city && addr1.city.toLowerCase() === addr2.city.toLowerCase()) {
        score += 1;
      }
      
      // Street match (most points, but need to normalize)
      if (addr1.street && addr2.street) {
        const normalizedStreet1 = normalizeStreet(addr1.street);
        const normalizedStreet2 = normalizeStreet(addr2.street);
        
        if (normalizedStreet1 === normalizedStreet2) {
          score += 3;
        }
      }
      
      maxScore = Math.max(maxScore, score);
    }
  }
  
  // Convert the score to a percentage of the total 5 possible points
  return Math.min((maxScore / 7) * 5, 5);
}

/**
 * Calculate composite confidence score
 */
export function calculateConfidenceScore(
  nameScore: number,
  emailScore: number,
  phoneScore: number,
  addressScore: number
): number {
  return Math.round(nameScore + emailScore + phoneScore + addressScore);
}

/**
 * Simple fuzzy matching for strings (similarity check)
 */
function fuzzyMatch(str1: string, str2: string): boolean {
  // Simple implementation - can be enhanced with Levenshtein distance or other algorithms
  if (Math.abs(str1.length - str2.length) > 2) {
    return false;
  }
  
  // Check for transposed characters
  if (str1.length === str2.length && str1.length > 3) {
    let differences = 0;
    for (let i = 0; i < str1.length; i++) {
      if (str1[i] !== str2[i]) {
        differences++;
      }
      if (differences > 2) {
        return false;
      }
    }
    return differences <= 2;
  }
  
  // Check if one is contained in the other
  return str1.includes(str2) || str2.includes(str1);
}

/**
 * Check if names are common nickname variations
 */
function isNicknameMatch(name1: string, name2: string): boolean {
  const nicknameMap: Record<string, string[]> = {
    'william': ['will', 'bill', 'billy'],
    'robert': ['rob', 'bob', 'bobby'],
    'richard': ['rick', 'dick', 'richie'],
    'michael': ['mike', 'mikey'],
    'james': ['jim', 'jimmy'],
    'christopher': ['chris'],
    'joseph': ['joe', 'joey'],
    'thomas': ['tom', 'tommy'],
    'charles': ['charlie', 'chuck'],
    'elizabeth': ['liz', 'beth', 'betty'],
    'jennifer': ['jen', 'jenny'],
    'margaret': ['maggie', 'meg', 'peggy'],
    'katherine': ['kate', 'katie', 'kathy'],
    'patricia': ['pat', 'patty', 'trish'],
  };
  
  name1 = name1.toLowerCase();
  name2 = name2.toLowerCase();
  
  // Check direct mapping
  if (nicknameMap[name1]?.includes(name2)) return true;
  if (nicknameMap[name2]?.includes(name1)) return true;
  
  // Check if both are nicknames for the same full name
  for (const [fullName, nicknames] of Object.entries(nicknameMap)) {
    if (nicknames.includes(name1) && nicknames.includes(name2)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Normalize street address for comparison
 */
function normalizeStreet(street: string): string {
  return street
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single
    .replace(/\bstreet\b|\bst\.?\b/g, 'st')
    .replace(/\bavenue\b|\bave\.?\b/g, 'ave')
    .replace(/\broad\b|\brd\.?\b/g, 'rd')
    .replace(/\bboulevard\b|\bblvd\.?\b/g, 'blvd')
    .replace(/\bsuite\b|\bste\.?\b|\bunit\b|\bapt\.?\b/g, '') // Remove suite/unit indicators
    .replace(/,/g, '') // Remove commas
    .replace(/\b\d+[a-z]?\b/g, '') // Remove numbers
    .replace(/n\.?|s\.?|e\.?|w\.?/g, '') // Remove cardinal directions
    .replace(/\bpo box\b|\bp\.?o\.?\s*box\b/g, 'pobox')
    .replace(/\W+/g, '') // Remove all non-alphanumeric characters
    .trim();
}

/**
 * Extract text email addresses from a contact
 */
export function extractEmailAddresses(emails: Array<{ email: string } | null> | undefined): string[] {
  if (!emails || !emails.length) {
    return [];
  }
  return emails.filter(Boolean).map(emailObj => emailObj!.email);
}

/**
 * Extract phone numbers from a contact
 */
export function extractPhoneNumbers(phones: Array<{ phone: string } | null> | undefined): string[] {
  if (!phones || !phones.length) {
    return [];
  }
  return phones.filter(Boolean).map(phoneObj => phoneObj!.phone);
}

/**
 * Extract addresses from a contact
 */
export function extractAddresses(locations: Array<{
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
} | null> | undefined) {
  if (!locations || !locations.length) {
    return [];
  }
  return locations.filter(Boolean);
}
