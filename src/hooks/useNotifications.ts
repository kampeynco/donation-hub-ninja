
import { useState } from 'react';
import { 
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchRecentNotifications,
  deleteNotification
} from '@/services/notifications';
import { Notification } from '@/components/Notifications/NotificationBell';
import { toast } from '@/hooks/use-toast';

export function useNotifications() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create a notification for a new donation
   */
  const createDonationNotification = async (
    donorName: string, 
    amount: number, 
    donorId: string | null = null
  ) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a notification for a recurring donation
   */
  const createRecurringDonationNotification = async (
    donorName: string, 
    amount: number, 
    period: string, 
    donorId: string | null = null
  ) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark a notification as read
   */
  const markAsRead = async (id: string) => {
    setIsLoading(true);
    try {
      return await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      return await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotificationById = async (id: string) => {
    setIsLoading(true);
    console.log(`useNotifications: Deleting notification with ID: ${id}`);
    try {
      const success = await deleteNotification(id);
      if (success) {
        console.log(`useNotifications: Successfully deleted notification with ID: ${id}`);
        return true;
      } else {
        console.error(`useNotifications: Failed to delete notification with ID: ${id}`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch recent notifications
   */
  const fetchNotifications = async (limit = 10): Promise<Notification[]> => {
    setIsLoading(true);
    try {
      const data = await fetchRecentNotifications(limit);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array instead of throwing to prevent UI from breaking
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createDonationNotification,
    createRecurringDonationNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationById,
    fetchNotifications
  };
}
