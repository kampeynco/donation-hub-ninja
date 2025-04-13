
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Notification } from '@/types/notification';
import NotificationTable from './NotificationTable';

interface NotificationTabContentProps {
  activeTab: string;
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationTabContent = ({ 
  activeTab, 
  notifications, 
  loading, 
  error, 
  onMarkAsRead, 
  onDelete 
}: NotificationTabContentProps) => {
  return (
    <TabsContent value={activeTab} className="mt-0">
      <NotificationTable
        notifications={notifications}
        loading={loading}
        error={error}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
      />
    </TabsContent>
  );
};

export default NotificationTabContent;
