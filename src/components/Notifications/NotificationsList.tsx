
import { Notification } from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconCalendar, IconCreditCard } from '@tabler/icons-react';
import { format } from 'date-fns';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  onClose: () => void;
}

const NotificationsList = ({
  notifications,
  loading,
  markAsRead,
  markAllAsRead,
  onClose
}: NotificationsListProps) => {
  const getNotificationIcon = (action: string) => {
    switch (action) {
      case 'recurring_donation':
        return <IconCalendar className="w-5 h-5 text-blue-500" />;
      case 'donation':
        return <IconCreditCard className="w-5 h-5 text-green-500" />;
      default:
        return <IconCreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between px-4 py-3 bg-primary-50">
        <h3 className="font-semibold text-primary">Notifications</h3>
        {notifications.some(n => !n.is_read) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs h-7"
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="max-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 ${notification.is_read ? '' : 'bg-blue-50'}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <Separator />
      
      <div className="px-4 py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationsList;
