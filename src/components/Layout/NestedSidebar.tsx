import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import SidebarItem from "./SidebarItem";
import SubSidebarItem from "./SubSidebarItem";
import { ROUTES } from "@/constants/routes";

const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/donorcamp_logo_blue.png";
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/donorcamp_logo_white.png";
const logo = LIGHT_LOGO_MARK;  // Default to light logo, but you can add theme logic if needed

interface NestedSidebarProps {
  className?: string;
}

export default function NestedSidebar({ className }: NestedSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeMainRoute = pathSegments[0] || '';
  const activeNestedRoute = pathSegments.length > 1 ? pathSegments[1] : '';
  
  const isProspectsActive = activeMainRoute === 'prospects';
  const isSettingsActive = activeMainRoute === 'settings';
  const isLogsActive = activeMainRoute === 'logs';

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className={cn("border-r bg-white dark:bg-gray-900", className)}>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <img
              src={logo}
              alt="Donor Camp"
              className="h-8 w-8 cursor-pointer"
            />
          </SidebarHeader>

          <SidebarContent>
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
                  isActive={isProspectsActive} 
                  hasNestedItems={true}
                />
                
                <SidebarItem 
                  icon="IconSettings" 
                  path={ROUTES.SETTINGS.ROOT} 
                  label="Settings" 
                  isActive={isSettingsActive} 
                  hasNestedItems={true}
                />
                
                <SidebarItem 
                  icon="IconBell" 
                  path={ROUTES.LOGS.ROOT} 
                  label="Logs" 
                  isActive={isLogsActive} 
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

        {(isProspectsActive || isSettingsActive || isLogsActive) && (
          <div className="w-48 shrink-0 border-r bg-white dark:bg-gray-800/50">
            <div className="p-2">
              <div className="px-2 py-4">
                <h3 className="mb-2 px-2 text-lg font-semibold">
                  {isProspectsActive && "Prospects"}
                  {isSettingsActive && "Settings"}
                  {isLogsActive && "Logs"}
                </h3>
                
                {isProspectsActive && (
                  <div className="space-y-1">
                    <SubSidebarItem
                      icon="IconAddressBook"
                      path={ROUTES.PROSPECTS.PROSPECTS}
                      label="Contacts"
                      isActive={activeNestedRoute === 'prospects'}
                    />
                    <SubSidebarItem
                      icon="IconHeartDollar"
                      path={ROUTES.PROSPECTS.DONORS}
                      label="Donors"
                      isActive={activeNestedRoute === 'donors'}
                    />
                    <SubSidebarItem
                      icon="IconLayersDifference"
                      path={ROUTES.PROSPECTS.MERGE}
                      label="Merge"
                      isActive={activeNestedRoute === 'merge'}
                    />
                  </div>
                )}
                
                {isSettingsActive && (
                  <div className="space-y-1">
                    <SubSidebarItem
                      icon="IconUserCircle"
                      path={ROUTES.SETTINGS.PROFILE}
                      label="Profile"
                      isActive={activeNestedRoute === 'profile'}
                    />
                    <SubSidebarItem
                      icon="IconBell"
                      path={ROUTES.SETTINGS.NOTIFICATIONS}
                      label="Notifications"
                      isActive={activeNestedRoute === 'notifications'}
                    />
                    <SubSidebarItem
                      icon="IconCreditCard"
                      path={ROUTES.SETTINGS.BILLING}
                      label="Billing"
                      isActive={activeNestedRoute === 'billing'}
                    />
                  </div>
                )}
                
                {isLogsActive && (
                  <div className="space-y-1">
                    <SubSidebarItem
                      icon="IconBell"
                      path={ROUTES.LOGS.ALL}
                      label="All Activity"
                      isActive={activeNestedRoute === 'all'}
                    />
                    <SubSidebarItem
                      icon="IconBellHeart"
                      path={ROUTES.LOGS.DONORS}
                      label="Donor Activity"
                      isActive={activeNestedRoute === 'donors'}
                    />
                    <SubSidebarItem
                      icon="IconBellBolt"
                      path={ROUTES.LOGS.ACCOUNT}
                      label="Account Activity"
                      isActive={activeNestedRoute === 'account'}
                    />
                    <SubSidebarItem
                      icon="IconBellCog"
                      path={ROUTES.LOGS.SYSTEM}
                      label="System Activity"
                      isActive={activeNestedRoute === 'system'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
