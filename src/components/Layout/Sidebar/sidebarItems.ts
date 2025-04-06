
import { 
  IconTent,
  IconActivity,
  IconAdjustments,
  IconStarFilled,
  IconPlugConnected,
  IconEmpathize,
  IconChartPie
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
    name: "Donors",
    path: "/universe",
    icon: IconEmpathize,
    badge: {
      text: "Beta",
      variant: "beta",
      icon: IconStarFilled
    },
    // Initial state is visible, will be updated by DashboardSidebar
    hidden: false
  },
  {
    name: "Segments",
    path: "/personas",
    icon: IconChartPie,
    badge: {
      text: "Beta",
      variant: "beta",
      icon: IconStarFilled
    },
    // Initial state is visible, will be updated by DashboardSidebar
    hidden: false
  },
  {
    name: "Activity",
    path: "/logs",
    icon: IconActivity,
    showNotificationBadge: true
  },
  {
    name: "Settings",
    path: "/account",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
