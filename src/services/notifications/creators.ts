
import { v4 as uuidv4 } from 'uuid';
import { createNewNotification } from './api';

/**
 * Create a notification for a new donation
 */
export async function createDonationNotification(
  amount: number,
  contactId: string,
  contactName: string | null
) {
  try {
    const message = `New $${amount} donation from ${contactName || 'a supporter'}`;
    const notification = {
      id: uuidv4(),
      message,
      created_at: new Date().toISOString(),
      is_read: false,
      action: 'donor' as const,
      contact_id: contactId,
      date: new Date().toISOString(),
      donor_id: contactId // Add donor_id for compatibility
    };
    
    return await createNewNotification(notification);
  } catch (error) {
    console.error('Error creating donation notification:', error);
    return false;
  }
}

/**
 * Create a notification for a recurring donation
 */
export async function createRecurringDonationNotification(
  amount: number,
  period: string,
  contactId: string,
  contactName: string | null
) {
  try {
    const message = `New recurring $${amount} ${period} donation from ${contactName || 'a supporter'}`;
    const notification = {
      id: uuidv4(),
      message,
      created_at: new Date().toISOString(),
      is_read: false,
      action: 'donor' as const,
      contact_id: contactId,
      date: new Date().toISOString(),
      donor_id: contactId // Add donor_id for compatibility
    };
    
    return await createNewNotification(notification);
  } catch (error) {
    console.error('Error creating recurring donation notification:', error);
    return false;
  }
}
