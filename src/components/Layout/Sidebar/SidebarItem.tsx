
import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  collapsed: boolean;
}

const SidebarItem = ({ name, path, icon: Icon, collapsed }: SidebarItemProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={path}
          className={({ isActive }) =>
            `flex flex-row items-center px-3 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-donor-blue text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${collapsed ? "justify-center" : ""}`
          }
        >
          <Icon className="h-5 w-5" />
          {!collapsed && <span className="ml-3 whitespace-nowrap">{name}</span>}
        </NavLink>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right">
          {name}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default SidebarItem;
