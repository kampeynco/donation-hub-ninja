import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Notification } from '@/components/Notifications/NotificationBell';
import NotificationRow from './NotificationRow';
import EmptyState from './EmptyState';
import LoadingRows from './LoadingRows';
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
  return <div className="rounded-md border bg-white">
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
          {loading ? <LoadingRows /> : error ? <EmptyState message="Error loading notifications. Please try refreshing the page." isError /> : notifications.length === 0 ? <EmptyState message="No notifications found" /> : notifications.map(notification => <NotificationRow key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} onDelete={onDelete} />)}
        </TableBody>
      </Table>
    </div>;
};
export default NotificationTable;