
import { createNotification } from './api';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a notification for a new donation
 */
export async function createDonationNotification(
  donorName: string, 
  amount: number, 
  donorId: string | null = null
): Promise<ReturnType<typeof createNotification> | null> {
  try {
    const formattedAmount = amount.toFixed(2);
    const message = `${donorName} donated $${formattedAmount}`;
    return await createNotification({
      message,
      action: 'donor',
      donorId
    });
  } catch (error) {
    console.error('Error creating donation notification:', error);
    toast({
      title: 'Error',
      description: 'Failed to create notification',
      variant: 'destructive'
    });
    return null;
  }
}

/**
 * Creates a notification for a recurring donation
 */
export async function createRecurringDonationNotification(
  donorName: string, 
  amount: number, 
  period: string, 
  donorId: string | null = null
): Promise<ReturnType<typeof createNotification> | null> {
  try {
    const formattedAmount = amount.toFixed(2);
    const message = `${donorName} set up a ${period} donation of $${formattedAmount}`;
    return await createNotification({
      message,
      action: 'donor',
      donorId
    });
  } catch (error) {
    console.error('Error creating recurring donation notification:', error);
    toast({
      title: 'Error',
      description: 'Failed to create notification',
      variant: 'destructive'
    });
    return null;
  }
}
