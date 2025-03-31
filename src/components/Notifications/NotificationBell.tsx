
import { useState, useEffect } from 'react';
import { IconBell } from '@tabler/icons-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import NotificationsList from './NotificationsList';
import { 
  fetchRecentNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification
} from '@/services/notifications';

export interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  date: string;
  action: 'user' | 'system' | 'donor';
  donor_id: string | null;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentNotifications(10);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch notifications',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

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
          setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    }
  };

  const handleDeleteNotification = async (id: string) => {
    const success = await deleteNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
          <IconBell size={24} className="text-gray-600" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center text-xs rounded-full">
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-lg" align="end">
        <NotificationsList
          notifications={notifications}
          loading={loading}
          markAsRead={handleMarkAsRead}
          markAllAsRead={handleMarkAllAsRead}
          deleteNotification={handleDeleteNotification}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
