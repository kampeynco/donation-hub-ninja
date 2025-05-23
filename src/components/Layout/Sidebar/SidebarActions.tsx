
import React from "react";
import { IconChevronLeft, IconMoonStars, IconSun } from "@tabler/icons-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarActionsProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarActions = ({ collapsed, toggleSidebar }: SidebarActionsProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Collapse button */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${collapsed ? "justify-center w-full" : "w-full flex items-center justify-start"}`}
            onClick={toggleSidebar}
          >
            <IconChevronLeft className="h-5 w-5 transition-transform" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            {collapsed ? "Expand" : "Collapse"}
          </TooltipContent>
        )}
      </Tooltip>

      {/* Theme Toggle */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${collapsed ? "justify-center w-full" : "w-full flex items-center justify-start"}`}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <IconMoonStars className="h-5 w-5" />
            ) : (
              <IconSun className="h-5 w-5" />
            )}
            {!collapsed && <span className="ml-2">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </Button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </TooltipContent>
        )}
      </Tooltip>
    </>
  );
};

export default SidebarActions;
