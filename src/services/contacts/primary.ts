
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";

/**
 * Sets an email as primary for a contact
 */
export async function setPrimaryEmail(contactId: string, emailId: string) {
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

    // Start a transaction to update primary status
    // First, set all emails for this contact as non-primary
    const { error: resetError } = await supabase
      .from('emails')
      .update({ is_primary: false })
      .eq('contact_id', contactId);

    if (resetError) {
      console.error('Error resetting primary emails:', resetError);
      return false;
    }

    // Then set the specified email as primary
    const { error: updateError } = await supabase
      .from('emails')
      .update({ is_primary: true })
      .eq('id', emailId)
      .eq('contact_id', contactId);

    if (updateError) {
      console.error('Error setting primary email:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setPrimaryEmail:', error);
    return false;
  }
}

/**
 * Sets a phone as primary for a contact
 */
export async function setPrimaryPhone(contactId: string, phoneId: string) {
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

    // Start a transaction to update primary status
    // First, set all phones for this contact as non-primary
    const { error: resetError } = await supabase
      .from('phones')
      .update({ is_primary: false })
      .eq('contact_id', contactId);

    if (resetError) {
      console.error('Error resetting primary phones:', resetError);
      return false;
    }

    // Then set the specified phone as primary
    const { error: updateError } = await supabase
      .from('phones')
      .update({ is_primary: true })
      .eq('id', phoneId)
      .eq('contact_id', contactId);

    if (updateError) {
      console.error('Error setting primary phone:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setPrimaryPhone:', error);
    return false;
  }
}

/**
 * Sets a location as primary for a contact
 */
export async function setPrimaryLocation(contactId: string, locationId: string) {
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

    // Start a transaction to update primary status
    // First, set all locations for this contact as non-primary
    const { error: resetError } = await supabase
      .from('locations')
      .update({ is_primary: false })
      .eq('contact_id', contactId);

    if (resetError) {
      console.error('Error resetting primary locations:', resetError);
      return false;
    }

    // Then set the specified location as primary
    const { error: updateError } = await supabase
      .from('locations')
      .update({ is_primary: true })
      .eq('id', locationId)
      .eq('contact_id', contactId);

    if (updateError) {
      console.error('Error setting primary location:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setPrimaryLocation:', error);
    return false;
  }
}

/**
 * Adds a new email to a contact
 */
export async function addEmailToContact(contactId: string, email: string, type: 'personal' | 'work' | 'other' = 'personal', isPrimary: boolean = false) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Check if contact belongs to the current user
    const { data: userContact, error: userContactError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .maybeSingle();
    
    if (userContactError || !userContact) {
      console.error('Error fetching user contact or contact not found:', userContactError);
      return null;
    }

    // If setting as primary, reset other emails first
    if (isPrimary) {
      const { error: resetError } = await supabase
        .from('emails')
        .update({ is_primary: false })
        .eq('contact_id', contactId);

      if (resetError) {
        console.error('Error resetting primary emails:', resetError);
        return null;
      }
    }

    // Add the new email
    const { data: newEmail, error: addError } = await supabase
      .from('emails')
      .insert({
        contact_id: contactId,
        email,
        type,
        is_primary: isPrimary
      })
      .select()
      .single();

    if (addError) {
      console.error('Error adding email to contact:', addError);
      return null;
    }

    return newEmail;
  } catch (error) {
    console.error('Error in addEmailToContact:', error);
    return null;
  }
}

/**
 * Adds a new phone to a contact
 */
export async function addPhoneToContact(contactId: string, phone: string, type: 'mobile' | 'home' | 'work' | 'other' = 'mobile', isPrimary: boolean = false) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Check if contact belongs to the current user
    const { data: userContact, error: userContactError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .maybeSingle();
    
    if (userContactError || !userContact) {
      console.error('Error fetching user contact or contact not found:', userContactError);
      return null;
    }

    // If setting as primary, reset other phones first
    if (isPrimary) {
      const { error: resetError } = await supabase
        .from('phones')
        .update({ is_primary: false })
        .eq('contact_id', contactId);

      if (resetError) {
        console.error('Error resetting primary phones:', resetError);
        return null;
      }
    }

    // Add the new phone
    const { data: newPhone, error: addError } = await supabase
      .from('phones')
      .insert({
        contact_id: contactId,
        phone,
        type,
        is_primary: isPrimary
      })
      .select()
      .single();

    if (addError) {
      console.error('Error adding phone to contact:', addError);
      return null;
    }

    return newPhone;
  } catch (error) {
    console.error('Error in addPhoneToContact:', error);
    return null;
  }
}

/**
 * Adds a new location to a contact
 */
export async function addLocationToContact(
  contactId: string, 
  locationData: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
  },
  type: 'home' | 'work' | 'mailing' | 'other' = 'home',
  isPrimary: boolean = false
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Check if contact belongs to the current user
    const { data: userContact, error: userContactError } = await supabase
      .from('user_contacts')
      .select('contact_id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .maybeSingle();
    
    if (userContactError || !userContact) {
      console.error('Error fetching user contact or contact not found:', userContactError);
      return null;
    }

    // If setting as primary, reset other locations first
    if (isPrimary) {
      const { error: resetError } = await supabase
        .from('locations')
        .update({ is_primary: false })
        .eq('contact_id', contactId);

      if (resetError) {
        console.error('Error resetting primary locations:', resetError);
        return null;
      }
    }

    // Add the new location
    const { data: newLocation, error: addError } = await supabase
      .from('locations')
      .insert({
        contact_id: contactId,
        street: locationData.street,
        city: locationData.city,
        state: locationData.state,
        zip: locationData.zip,
        country: locationData.country,
        type,
        is_primary: isPrimary
      })
      .select()
      .single();

    if (addError) {
      console.error('Error adding location to contact:', addError);
      return null;
    }

    return newLocation;
  } catch (error) {
    console.error('Error in addLocationToContact:', error);
    return null;
  }
}
