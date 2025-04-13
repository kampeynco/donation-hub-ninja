
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";

/**
 * Contact data interface for create and update operations
 */
export interface ContactData {
  first_name?: string | null;
  last_name?: string | null;
  status?: 'prospect' | 'active' | 'donor';
  is_express?: boolean;
  is_mobile?: boolean;
  is_paypal?: boolean;
  is_eligible_for_express_lane?: boolean;
}

/**
 * Email data interface
 */
export interface EmailData {
  email: string;
  type?: 'personal' | 'work' | 'other';
  is_primary?: boolean;
}

/**
 * Phone data interface
 */
export interface PhoneData {
  phone: string;
  type?: 'mobile' | 'home' | 'work' | 'other';
  is_primary?: boolean;
}

/**
 * Address data interface
 */
export interface LocationData {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  type?: 'home' | 'work' | 'mailing' | 'other';
  is_primary?: boolean;
}

/**
 * Fetches a list of contacts associated with the current user
 */
export async function fetchContacts(filters = {}, page = 1, limit = 20) {
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

    // First get the total count
    const { count, error: countError } = await supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .in('id', contactIds)
      .match(filters);
    
    if (countError) {
      console.error('Error counting contacts:', countError);
      return { data: [], count: 0 };
    }

    // Then fetch the paginated data
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        status,
        created_at,
        updated_at,
        is_express,
        is_mobile,
        is_paypal,
        is_eligible_for_express_lane,
        emails!left (
          id,
          email,
          type,
          is_primary,
          verified
        ),
        phones!left (
          id,
          phone,
          type,
          is_primary,
          verified
        ),
        locations!left (
          id,
          street,
          city,
          state,
          zip,
          country,
          type,
          is_primary
        ),
        donations!left (
          id,
          amount,
          paid_at,
          recurring_period
        )
      `)
      .in('id', contactIds)
      .match(filters)
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      return { data: [], count: 0 };
    }

    return { 
      data: contacts || [], 
      count: count || 0
    };
  } catch (error) {
    console.error('Error in fetchContacts:', error);
    return { data: [], count: 0 };
  }
}

/**
 * Fetches a single contact by ID
 */
export async function fetchContactById(contactId: string) {
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

    // Fetch the contact with all related data
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select(`
        id,
        first_name,
        last_name,
        status,
        created_at,
        updated_at,
        is_express,
        is_mobile,
        is_paypal,
        is_eligible_for_express_lane,
        emails (
          id,
          email,
          type,
          is_primary,
          verified
        ),
        phones (
          id,
          phone,
          type,
          is_primary,
          verified
        ),
        locations (
          id,
          street,
          city,
          state,
          zip,
          country,
          type,
          is_primary
        ),
        employer_data (
          id,
          employer,
          occupation,
          employer_addr1,
          employer_city,
          employer_state,
          employer_country
        ),
        donations (
          id,
          amount,
          paid_at,
          recurring_period,
          recurring_duration,
          status,
          committee_name,
          contribution_form,
          order_number
        )
      `)
      .eq('id', contactId)
      .single();

    if (contactError) {
      console.error('Error fetching contact:', contactError);
      return null;
    }

    return contact;
  } catch (error) {
    console.error('Error in fetchContactById:', error);
    return null;
  }
}

/**
 * Creates a new contact with given data
 */
export async function createContact(contactData: ContactData, email?: EmailData, phone?: PhoneData, location?: LocationData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Start a transaction to create the contact and associated records
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert({ 
        ...contactData,
        status: contactData.status || 'prospect'
      })
      .select()
      .single();
    
    if (contactError) {
      console.error('Error creating contact:', contactError);
      return null;
    }

    // Associate the contact with the current user
    const { error: userContactError } = await supabase
      .from('user_contacts')
      .insert({
        user_id: userId,
        contact_id: contact.id
      });

    if (userContactError) {
      console.error('Error associating contact with user:', userContactError);
      // We don't return null here as the contact was created successfully
    }

    // Add email if provided
    if (email) {
      const { error: emailError } = await supabase
        .from('emails')
        .insert({
          contact_id: contact.id,
          email: email.email,
          type: email.type || 'personal',
          is_primary: email.is_primary !== undefined ? email.is_primary : true
        });

      if (emailError) {
        console.error('Error adding email to contact:', emailError);
      }
    }

    // Add phone if provided
    if (phone) {
      const { error: phoneError } = await supabase
        .from('phones')
        .insert({
          contact_id: contact.id,
          phone: phone.phone,
          type: phone.type || 'mobile',
          is_primary: phone.is_primary !== undefined ? phone.is_primary : true
        });

      if (phoneError) {
        console.error('Error adding phone to contact:', phoneError);
      }
    }

    // Add location if provided
    if (location) {
      const { error: locationError } = await supabase
        .from('locations')
        .insert({
          contact_id: contact.id,
          street: location.street,
          city: location.city,
          state: location.state,
          zip: location.zip,
          country: location.country,
          type: location.type || 'home',
          is_primary: location.is_primary !== undefined ? location.is_primary : true
        });

      if (locationError) {
        console.error('Error adding location to contact:', locationError);
      }
    }

    return contact;
  } catch (error) {
    console.error('Error in createContact:', error);
    return null;
  }
}

/**
 * Updates an existing contact
 */
export async function updateContact(contactId: string, contactData: ContactData) {
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

    // Update the contact
    const { data: updatedContact, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      return null;
    }

    return updatedContact;
  } catch (error) {
    console.error('Error in updateContact:', error);
    return null;
  }
}

/**
 * Deletes a contact
 */
export async function deleteContact(contactId: string) {
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

    // First remove the association with the user
    const { error: deleteUserContactError } = await supabase
      .from('user_contacts')
      .delete()
      .eq('user_id', userId)
      .eq('contact_id', contactId);

    if (deleteUserContactError) {
      console.error('Error removing contact association:', deleteUserContactError);
      return false;
    }

    // Then delete the contact itself (this will cascade delete related records)
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      console.error('Error deleting contact:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteContact:', error);
    return false;
  }
}
