
import React from 'react';
import { IconCalendar, IconCreditCard, IconUser } from '@tabler/icons-react';

interface NotificationIconProps {
  action: string;
}

const NotificationIcon = ({ action }: NotificationIconProps) => {
  switch (action) {
    case 'donor':
      return <IconCalendar className="w-5 h-5 text-donor-blue" />;
    case 'user':
      return <IconUser className="w-5 h-5 text-primary" />;
    case 'system':
    default:
      return <IconCreditCard className="w-5 h-5 text-donor-green" />;
  }
};

export default NotificationIcon;
