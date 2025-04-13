
import React from 'react';
import { format } from 'date-fns';
import { IconTrash } from '@tabler/icons-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import NotificationIcon from './NotificationIcon';

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationRow = ({ notification, onMarkAsRead, onDelete }: NotificationRowProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`NotificationRow: Deleting notification with ID: ${notification.id}`);
    onDelete(notification.id);
  };

  return (
    <TableRow 
      className={!notification.is_read 
        ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-800/70'}
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
      <TableCell className="text-gray-600 dark:text-gray-400">
        {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost" 
          size="icon"
          onClick={handleDelete}
          aria-label="Delete notification"
        >
          <IconTrash size={16} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default NotificationRow;
