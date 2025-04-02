
import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BadgeCustom } from "@/components/ui/badge-custom";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  collapsed: boolean;
  badge?: {
    text: string;
    variant: string;
  };
}

const SidebarItem = ({ name, path, icon: Icon, collapsed, badge }: SidebarItemProps) => {
  return (
    <div className="px-3 py-2">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={path}
            className="w-full block"
          >
            {({ isActive }) => (
              <div className="relative w-full">
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
                
                {!collapsed && badge && (
                  <div className="absolute top-1 right-2">
                    <BadgeCustom 
                      variant={badge.variant as any}
                      className={isActive ? "bg-white/20 text-white border-white/30 dark:bg-white/20 dark:text-white dark:border-white/30" : ""}
                    >
                      {badge.text}
                    </BadgeCustom>
                  </div>
                )}
              </div>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            <div className="flex items-center gap-2">
              {name}
              {badge && (
                <BadgeCustom variant={badge.variant as any} className="ml-1">{badge.text}</BadgeCustom>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};

export default SidebarItem;
