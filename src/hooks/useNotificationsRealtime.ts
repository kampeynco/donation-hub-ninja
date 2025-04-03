
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/components/Notifications/NotificationBell';
import { toast } from '@/hooks/use-toast';

export function useNotificationsRealtime(
  userId?: string,
  isInitialized: boolean = false,
  updateNotifications: (updater: (prev: Notification[]) => Notification[]) => void
) {
  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

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
          updateNotifications(prev => [payload.new as Notification, ...prev]);
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
          updateNotifications(prev => prev.filter(n => n.id !== payload.old.id));
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
          updateNotifications(prev => 
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
  }, [userId, isInitialized, updateNotifications]);
}
