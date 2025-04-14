
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { IconType } from '@/types/icon';

interface NavItemProps {
  to: string;
  label: string;
  icon: IconType;
  isActive: boolean;
}

const NavItem = ({ to, label, icon: Icon, isActive }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-donor-blue text-white" 
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
    >
      <Icon className="h-5 w-5" style={{ height: "1.25rem", width: "1.25rem" }} />
      <span>{label}</span>
    </NavLink>
  );
};

interface DashboardNestedNavProps {
  items: Array<{
    to: string;
    label: string;
    icon: IconType;
  }>;
  basePath: string;
}

const DashboardNestedNav: React.FC<DashboardNestedNavProps> = ({ items, basePath }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to determine if a nav item is active
  const isActive = (path: string): boolean => {
    return currentPath === path || (currentPath === basePath && path === items[0].to);
  };

  return (
    <div className="mb-6 border-b pb-4">
      <nav className="flex space-x-2">
        {items.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={isActive(item.to)}
          />
        ))}
      </nav>
    </div>
  );
};

export default DashboardNestedNav;
