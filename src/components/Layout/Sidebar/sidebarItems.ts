
import { 
  IconTent,
  IconActivity,
  IconCurrentLocation,
  IconAdjustments,
  IconSparkles
} from "@tabler/icons-react";

export interface SidebarItemType {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: {
    text: string;
    variant: string;
    icon?: React.ComponentType<any>;
  };
  showNotificationBadge?: boolean;
  hidden?: boolean;
}

// Define the initial sidebar items without checking localStorage
// This prevents issues with rendering on server-side or during initialization
const sidebarItems: SidebarItemType[] = [
  {
    name: "Camp",
    path: "/dashboard",
    icon: IconTent,
  },
  {
    name: "Logs",
    path: "/logs",
    icon: IconActivity,
    showNotificationBadge: true
  },
  {
    name: "Personas",
    path: "/personas",
    icon: IconCurrentLocation,
    badge: {
      text: "Beta",
      variant: "beta",
      icon: IconSparkles
    },
    // Initial state is visible, will be updated by DashboardSidebar
    hidden: false
  },
  {
    name: "Settings",
    path: "/account",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
