
import React from 'react';
import DashboardNestedNav from './DashboardNestedNav';
import {
  IconUserCircle,
  IconBell,
  IconCreditCard
} from '@tabler/icons-react';

const SettingsNav: React.FC = () => {
  const navItems = [
    {
      to: '/account',
      label: 'Profile',
      icon: IconUserCircle,
    },
    {
      to: '/account/notifications',
      label: 'Notifications',
      icon: IconBell,
    },
    {
      to: '/account/billing',
      label: 'Billing',
      icon: IconCreditCard,
    },
  ];

  return <DashboardNestedNav items={navItems} basePath="/account" />;
};

export default SettingsNav;
