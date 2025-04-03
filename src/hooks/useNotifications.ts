
import { useState } from 'react';
import { 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchRecentNotifications,
  deleteNotification,
  createDonationNotification,
  createRecurringDonationNotification
} from '@/services/notifications';
import { Notification } from '@/components/Notifications/NotificationBell';

/**
 * Hook for working with notifications
 */
export function useNotifications() {
  const [isLoading, setIsLoading] = useState(false);

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
