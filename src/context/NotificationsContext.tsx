
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '@/components/Notifications/NotificationBell';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface NotificationsContextType {
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
  filterByAction: (action: string) => Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const { markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchNotifications(50);
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      // Don't clear notifications array if there's an error - keep previous state
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    // Only load if not initialized yet or explicitly triggered
    if (!isInitialized) {
      loadNotifications();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('DELETE event received for notification:', payload.old.id);
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n)
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications channel');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notifications channel');
          toast({
            title: 'Notification Error',
            description: 'Unable to get real-time notifications. Please refresh the page.',
            variant: 'destructive',
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isInitialized, loadNotifications]);

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
    console.log(`Context: Handling deletion for notification ID: ${id}`);
    try {
      const success = await deleteNotification(id);
      if (success) {
        console.log(`Context: Successfully deleted notification ID: ${id}, updating state`);
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast({
          title: 'Success',
          description: 'Notification deleted',
        });
      } else {
        console.error(`Context: Failed to delete notification ID: ${id}`);
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

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        filterByAction,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
