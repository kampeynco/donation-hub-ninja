
import React from 'react';
import DashboardNestedNav from './DashboardNestedNav';
import {
  IconBell,
  IconBellHeart,
  IconBellBolt,
  IconBellCog
} from '@tabler/icons-react';

const LogsNav: React.FC = () => {
  const navItems = [
    {
      to: '/logs',
      label: 'All',
      icon: IconBell,
    },
    {
      to: '/logs/donors',
      label: 'Donors',
      icon: IconBellHeart,
    },
    {
      to: '/logs/account',
      label: 'Account',
      icon: IconBellBolt,
    },
    {
      to: '/logs/system',
      label: 'System',
      icon: IconBellCog,
    },
  ];

  return <DashboardNestedNav items={navItems} basePath="/logs" />;
};

export default LogsNav;
