
import React from 'react';
import { format } from 'date-fns';
import { IconCalendar, IconCreditCard, IconUser, IconX } from '@tabler/icons-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Notification } from '@/components/Notifications/NotificationBell';

interface NotificationTableProps {
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationTable = ({ 
  notifications, 
  loading, 
  error, 
  onMarkAsRead, 
  onDelete 
}: NotificationTableProps) => {
  const getNotificationIcon = (action: string) => {
    switch (action) {
      case 'donor':
        return <IconCalendar className="w-5 h-5 text-blue-500" />;
      case 'user':
        return <IconUser className="w-5 h-5 text-primary" />;
      case 'system':
      default:
        return <IconCreditCard className="w-5 h-5 text-green-500" />;
    }
  };

  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`loading-${index}`}>
        <TableCell>
          <Skeleton className="h-8 w-8 rounded-full" />
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8 rounded-full" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderLoadingRows()
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-destructive">
                Error loading notifications. Please try refreshing the page.
              </TableCell>
            </TableRow>
          ) : notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No notifications found
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow 
                key={notification.id}
                className={!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : undefined}
                onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getNotificationIcon(notification.action)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{notification.message}</span>
                    {!notification.is_read && (
                      <Badge variant="outline" className="w-fit mt-1">Unread</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                  >
                    <IconX size={16} />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationTable;
