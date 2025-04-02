
import React from "react";
import { IconPower } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProfileProps {
  collapsed: boolean;
}

const SidebarProfile = ({ collapsed }: SidebarProfileProps) => {
  const { user, signOut } = useAuth();

  const getInitials = () => {
    const committeeName = user?.user_metadata?.committee_name;
    if (committeeName) {
      return committeeName.substring(0, 2).toUpperCase();
    }
    const email = user?.email || "";
    return email.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.committee_name || "Demo Committee";
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className={`flex ${collapsed ? "justify-center" : "items-center justify-between"}`}>
          <div className="flex items-center">
            <Avatar className="h-9 w-9 border-2 border-gray-200">
              <AvatarFallback className="bg-donor-blue text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium truncate max-w-[120px]">{getUserDisplayName()}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-auto p-1 text-gray-500 hover:text-red-500"
              onClick={signOut}
              aria-label="Sign out"
            >
              <IconPower className="h-5 w-5" />
            </Button>
          )}
        </div>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" className="flex flex-col gap-2 p-2">
          <p className="text-sm font-medium">{getUserDisplayName()}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-2"
            onClick={signOut}
          >
            <IconPower className="h-4 w-4" />
            Sign out
          </Button>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default SidebarProfile;
