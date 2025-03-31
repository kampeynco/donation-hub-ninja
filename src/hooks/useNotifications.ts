import { useState } from 'react';
import { 
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchRecentNotifications,
  deleteNotification
} from '@/services/notifications';
import { Notification } from '@/components/Notifications/NotificationBell';

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
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotificationById = async (id: string) => {
    setIsLoading(true);
    try {
      return await deleteNotification(id);
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
      return await fetchRecentNotifications(limit);
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
