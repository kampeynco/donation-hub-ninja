
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface NotificationTabsProps {
  activeTab: string;
  unreadCounts: {
    all: number;
    donor: number;
    system: number;
    user: number;
  };
}

const NotificationTabs = ({ activeTab, unreadCounts }: NotificationTabsProps) => {
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="all" className="relative">
        All
        {unreadCounts.all > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {unreadCounts.all}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="donor" className="relative">
        Donors
        {unreadCounts.donor > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {unreadCounts.donor}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="user" className="relative">
        Account
        {unreadCounts.user > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {unreadCounts.user}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="system" className="relative">
        System
        {unreadCounts.system > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {unreadCounts.system}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
};

export default NotificationTabs;
