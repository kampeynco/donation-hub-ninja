
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import SidebarItem from "./SidebarItem";
import SubSidebarItem from "./SubSidebarItem";
import logo from "/lovable-uploads/updated_dc_logomark_light.png";
import { useAuth } from "@/context/AuthContext";

// Route constants
import { ROUTES } from "@/constants/routes";

interface NestedSidebarProps {
  className?: string;
}

export default function NestedSidebar({ className }: NestedSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine active main route
  const activeMainRoute = location.pathname.split('/')[1] || '';

  // Render the nested sidebar
  return (
    <SidebarProvider>
      <Sidebar className={cn("border-r", className)}>
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <img
            src={logo}
            alt="Donor Camp"
            className="h-8 w-8"
            onClick={() => navigate('/dashboard')}
          />
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <div className="space-y-1 py-2">
              <SidebarItem 
                icon="IconHome" 
                path={ROUTES.DASHBOARD} 
                label="Dashboard" 
                isActive={activeMainRoute === 'dashboard'} 
              />
              
              <SidebarItem 
                icon="IconSearch" 
                path={ROUTES.PROSPECTS.ROOT} 
                label="Prospects" 
                isActive={activeMainRoute === 'prospects'} 
                hasNestedItems={true}
              />
              
              <SidebarItem 
                icon="IconSettings" 
                path={ROUTES.SETTINGS.ROOT} 
                label="Settings" 
                isActive={activeMainRoute === 'settings'} 
                hasNestedItems={true}
              />
              
              <SidebarItem 
                icon="IconBell" 
                path={ROUTES.LOGS.ROOT} 
                label="Logs" 
                isActive={activeMainRoute === 'logs'} 
                hasNestedItems={true}
              />
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{user.email}</div>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
