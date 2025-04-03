import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationsContext } from '@/context/NotificationsContext';
import LogsHeader from '@/components/Logs/LogsHeader';
import NotificationTabs from '@/components/Logs/NotificationTabs';
import NotificationTabContent from '@/components/Logs/NotificationTabContent';
const Logs = () => {
  const {
    notifications,
    loading,
    error,
    filterByAction,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationsContext();
  const [activeTab, setActiveTab] = useState('all');
  const getUnreadCount = (action?: string) => {
    if (!action || action === 'all') {
      return notifications.filter(n => !n.is_read).length;
    }
    return notifications.filter(n => !n.is_read && n.action === action).length;
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  const handleDeleteNotification = async (id: string) => {
    console.log(`Logs page: Deleting notification with ID: ${id}`);
    await deleteNotification(id);
  };
  const filteredNotifications = filterByAction(activeTab === 'all' ? 'all' : activeTab);
  const hasUnread = getUnreadCount() > 0;
  const unreadCounts = {
    all: getUnreadCount(),
    donor: getUnreadCount('donor'),
    system: getUnreadCount('system'),
    user: getUnreadCount('user')
  };
  return <div className="container mx-auto py-6 space-y-6">
      <LogsHeader title="Activity Logs" hasUnread={hasUnread} onMarkAllAsRead={markAllAsRead} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            
            
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <NotificationTabs activeTab={activeTab} unreadCounts={unreadCounts} />
            
            <NotificationTabContent activeTab={activeTab} notifications={filteredNotifications} loading={loading} error={error} onMarkAsRead={markAsRead} onDelete={handleDeleteNotification} />
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default Logs;