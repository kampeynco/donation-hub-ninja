
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useNotificationsContext } from '@/context/NotificationsContext';
import LogsHeader from '@/components/Logs/LogsHeader';
import NotificationTabs from '@/components/Logs/NotificationTabs';
import NotificationTabContent from '@/components/Logs/NotificationTabContent';
import LogsNav from '@/components/Layout/NestedNav/LogsNav';
import { useLocation } from 'react-router-dom';

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
  
  const location = useLocation();
  const path = location.pathname;
  let activeTab = 'all';
  
  // Map paths to tab values
  if (path === '/logs/donors') activeTab = 'donor';
  else if (path === '/logs/account') activeTab = 'user';
  else if (path === '/logs/system') activeTab = 'system';

  const getUnreadCount = (action?: string) => {
    if (!action || action === 'all') {
      return notifications.filter(n => !n.is_read).length;
    }
    return notifications.filter(n => !n.is_read && n.action === action).length;
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <LogsHeader title="Activity Logs" hasUnread={hasUnread} onMarkAllAsRead={markAllAsRead} />
      
      <LogsNav />
      
      <Tabs value={activeTab}>
        <NotificationTabContent 
          activeTab={activeTab} 
          notifications={filteredNotifications} 
          loading={loading} 
          error={error} 
          onMarkAsRead={markAsRead} 
          onDelete={handleDeleteNotification} 
        />
      </Tabs>
    </div>
  );
};

export default Logs;
