
import React from 'react';
import { Button } from '@/components/ui/button';

interface LogsHeaderProps {
  title: string;
  hasUnread: boolean;
  onMarkAllAsRead: () => void;
}

const LogsHeader = ({ title, hasUnread, onMarkAllAsRead }: LogsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      {hasUnread && (
        <Button onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      )}
    </div>
  );
};

export default LogsHeader;
