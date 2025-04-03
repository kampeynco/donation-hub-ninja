
import React, { useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely get notifications context
  let unreadCount = 0;
  try {
    // Only try to access notifications context if badge is needed
    if (showNotificationBadge) {
      const { notifications } = useNotificationsContext();
      unreadCount = notifications.filter(n => !n.is_read).length;
    }
  } catch (error) {
    console.error("Notifications context not available:", error);
  }

  // Determine if this item is active (exact path match or starts with path for nested routes)
  const isActive = location.pathname === path || 
    (path !== '/' && location.pathname.startsWith(path + '/'));

  // Handle manual click for refresh logic
  const handleClick = useCallback((e: React.MouseEvent) => {
    // If already on the same path, we want to force a re-render of the route
    if (isActive) {
      e.preventDefault();
      console.log("Reloading current route:", path);
      // Simply re-navigate to the same route to trigger a refresh
      navigate(path, { replace: true });
    }
  }, [isActive, navigate, path]);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={path}
          className="block"
          end={path === '/' || path === '/dashboard'} // Only use end for home and dashboard
          onClick={handleClick}
        >
          {({ isActive: navLinkActive }) => (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${collapsed ? "justify-center w-full" : "w-full flex items-center justify-start"} ${
                  navLinkActive ? "bg-donor-blue text-white hover:bg-donor-blue hover:text-white" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2">{name}</span>}
              </Button>
              
              {!collapsed && badge && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                  <BadgeCustom 
                    variant={badge.variant as any}
                    className={`flex items-center gap-1 ${navLinkActive ? "bg-white/20 text-white border-white/30 dark:bg-white/20 dark:text-white dark:border-white/30" : ""}`}
                  >
                    {badge.icon && <badge.icon className="h-3 w-3" />}
                    {badge.text}
                  </BadgeCustom>
                </div>
              )}

              {showNotificationBadge && unreadCount > 0 && (
                <>
                  {collapsed ? (
                    <div className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" /> 
                  ) : (
                    <div className="absolute top-1/2 -translate-y-1/2 right-2">
                      <Badge 
                        variant="destructive"
                        className={`flex items-center justify-center ${
                          navLinkActive ? "bg-white text-donor-blue hover:bg-white hover:text-donor-blue" : "hover:bg-destructive"
                        }`}
                      >
                        {unreadCount}
                      </Badge>
                    </div>
                  )}
                </>
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
  );
};

export default SidebarItem;
