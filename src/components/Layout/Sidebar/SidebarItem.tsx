
import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  collapsed: boolean;
}

const SidebarItem = ({ name, path, icon: Icon, collapsed }: SidebarItemProps) => {
  return (
    <div className="px-3 py-2">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={path}
            className="w-full block"
          >
            {({ isActive }) => (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${collapsed ? "justify-center w-full" : "w-full flex items-center justify-start"} ${
                  isActive ? "bg-donor-blue text-white hover:bg-donor-blue hover:text-white" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2 whitespace-nowrap">{name}</span>}
              </Button>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            {name}
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};

export default SidebarItem;
