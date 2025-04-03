
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

// Function to check if Personas should be hidden
const shouldHidePersonas = (): boolean => {
  return localStorage.getItem("hidePersonasSidebar") === "true";
};

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
    hidden: shouldHidePersonas()
  },
  {
    name: "Settings",
    path: "/account",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
