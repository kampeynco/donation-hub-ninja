
import React from 'react';
import DashboardNestedNav from './DashboardNestedNav';
import { 
  IconAddressBook, 
  IconHeartDollar, 
  IconLayersDifference 
} from '@tabler/icons-react';

const ProspectsNav: React.FC = () => {
  const navItems = [
    {
      to: '/prospects',
      label: 'Prospects',
      icon: IconAddressBook,
    },
    {
      to: '/prospects/donors',
      label: 'Donors',
      icon: IconHeartDollar,
    },
    {
      to: '/prospects/merge',
      label: 'Merge Duplicates',
      icon: IconLayersDifference,
    },
  ];

  return <DashboardNestedNav items={navItems} basePath="/prospects" />;
};

export default ProspectsNav;
