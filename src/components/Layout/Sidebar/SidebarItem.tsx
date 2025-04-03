
import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Badge } from "@/components/ui/badge";
import { useNotificationsContext } from "@/context/NotificationsContext";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  collapsed: boolean;
  badge?: {
    text: string;
    variant: string;
    icon?: React.ComponentType<any>;
  };
  showNotificationBadge?: boolean;
}

const SidebarItem = ({ 
  name, 
  path, 
  icon: Icon, 
  collapsed, 
  badge, 
  showNotificationBadge 
}: SidebarItemProps) => {
  const { notifications } = useNotificationsContext();
  const unreadCount = notifications.filter(n => !n.is_read).length;

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
                  {!collapsed && <span className="ml-2">{name}</span>}
                </Button>
                
                {!collapsed && badge && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-2">
                    <BadgeCustom 
                      variant={badge.variant as any}
                      className={`flex items-center gap-1 ${isActive ? "bg-white/20 text-white border-white/30 dark:bg-white/20 dark:text-white dark:border-white/30" : ""}`}
                    >
                      {badge.icon && <badge.icon className="h-3 w-3" />}
                      {badge.text}
                    </BadgeCustom>
                  </div>
                )}

                {showNotificationBadge && unreadCount > 0 && (
                  <div className={`absolute ${collapsed ? 'top-1/2 -translate-y-1/2 right-0' : 'top-1/2 -translate-y-1/2 right-2'}`}>
                    <Badge 
                      variant="destructive"
                      className={`flex items-center justify-center ${
                        isActive ? "bg-white text-donor-blue hover:bg-white hover:text-donor-blue" : "hover:bg-destructive"
                      }`}
                    >
                      {unreadCount}
                    </Badge>
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
                <BadgeCustom variant={badge.variant as any} className="flex items-center gap-1 ml-1">
                  {badge.icon && <badge.icon className="h-3 w-3" />}
                  {badge.text}
                </BadgeCustom>
              )}
              {showNotificationBadge && unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};

export default SidebarItem;
