
import React from 'react';
import { format } from 'date-fns';
import { IconTrash } from '@tabler/icons-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notification } from '@/components/Notifications/NotificationBell';
import NotificationIcon from './NotificationIcon';

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationRow = ({ notification, onMarkAsRead, onDelete }: NotificationRowProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <TableRow 
      className={!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : undefined}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
    >
      <TableCell>
        <div className="flex items-center justify-center">
          <NotificationIcon action={notification.action} />
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
          onClick={handleDelete}
          aria-label="Delete notification"
        >
          <IconTrash size={16} className="text-gray-500 hover:text-red-500" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default NotificationRow;
