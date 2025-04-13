
import { useState } from 'react';
import { IconBell } from '@tabler/icons-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useNotificationsContext } from '@/context/NotificationsContext';
import NotificationsList from './NotificationsList';

export interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  date: string;
  action: 'user' | 'system' | 'donor';
  donor_id: string | null;
  contact_id?: string | null; // Add contact_id for compatibility with new schema
}

const NotificationBell = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsContext();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
          notifications={notifications.slice(0, 10)} // Only show the most recent 10
          loading={false}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          deleteNotification={deleteNotification}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
