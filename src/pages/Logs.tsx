
import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconCalendar, IconCreditCard, IconUser, IconX } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useNotificationsContext } from '@/context/NotificationsContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getFilteredNotifications = () => {
    return filterByAction(activeTab === 'all' ? 'all' : activeTab);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getUnreadCount = (action?: string) => {
    if (!action || action === 'all') {
      return notifications.filter(n => !n.is_read).length;
    }
    return notifications.filter(n => !n.is_read && n.action === action).length;
  };

  const filteredNotifications = getFilteredNotifications();
  const hasUnread = getUnreadCount() > 0;

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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        {hasUnread && (
          <Button onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-sm font-normal text-muted-foreground">
              {notifications.length} total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="relative">
                All
                {getUnreadCount() > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {getUnreadCount()}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="donor" className="relative">
                Donations
                {getUnreadCount('donor') > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {getUnreadCount('donor')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="system" className="relative">
                System
                {getUnreadCount('system') > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {getUnreadCount('system')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="user" className="relative">
                User
                {getUnreadCount('user') > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {getUnreadCount('user')}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
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
                    ) : filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No notifications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <TableRow 
                          key={notification.id}
                          className={!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : undefined}
                          onClick={() => !notification.is_read && markAsRead(notification.id)}
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
                                deleteNotification(notification.id);
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
