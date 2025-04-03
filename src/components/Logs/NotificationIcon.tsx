
import React from 'react';
import { IconMoodDollar, IconWorldExclamation, IconServerSpark } from '@tabler/icons-react';

interface NotificationIconProps {
  action: string;
}

const NotificationIcon = ({ action }: NotificationIconProps) => {
  switch (action) {
    case 'donor':
      return <IconMoodDollar className="w-5 h-5 text-donor-blue" />;
    case 'user':
      return <IconWorldExclamation className="w-5 h-5 text-primary" />;
    case 'system':
    default:
      return <IconServerSpark className="w-5 h-5 text-donor-green" />;
  }
};

export default NotificationIcon;
