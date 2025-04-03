
import React, { createContext, useContext } from 'react';
import { Notification } from '@/components/Notifications/NotificationBell';
import { useAuth } from './AuthContext';
import { useNotificationsState } from '@/hooks/useNotificationsState';
import { useNotificationsRealtime } from '@/hooks/useNotificationsRealtime';
import { useEffect } from 'react';

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
  const { user } = useAuth();
  
  const {
    notifications,
    loading,
    error,
    isInitialized,
    filterByAction,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadNotifications,
    updateNotifications
  } = useNotificationsState(user?.id);

  // Initialize data loading
  useEffect(() => {
    if (user && !isInitialized) {
      loadNotifications();
    }
  }, [user, isInitialized, loadNotifications]);

  // Set up real-time subscriptions
  useNotificationsRealtime(user?.id, isInitialized, updateNotifications);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        filterByAction,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
