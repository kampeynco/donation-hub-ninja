
import { useState, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
import type { Notification } from '@/types/notification';

export function useNotificationsState(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await fetchNotifications(50);
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [userId, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const success = await markAllAsRead();
      if (success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    console.log(`State Hook: Handling deletion for notification ID: ${id}`);
    try {
      const success = await deleteNotification(id);
      if (success) {
        console.log(`State Hook: Successfully deleted notification ID: ${id}, updating state`);
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        console.error(`State Hook: Failed to delete notification ID: ${id}`);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const filterByAction = (action: string) => {
    if (action === 'all') {
      return notifications;
    }
    return notifications.filter(n => n.action === action);
  };

  const updateNotifications = useCallback((updater: (prev: Notification[]) => Notification[]) => {
    setNotifications(updater);
  }, []);

  return {
    notifications,
    loading,
    error,
    isInitialized,
    setIsInitialized,
    filterByAction,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    loadNotifications,
    updateNotifications
  };
}
