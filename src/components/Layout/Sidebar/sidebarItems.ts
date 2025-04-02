
import { 
  IconCampfire,
  IconArrowsRightLeft,
  IconCurrentLocation,
  IconAdjustments
} from "@tabler/icons-react";

export interface SidebarItemType {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: {
    text: string;
    variant: string;
  };
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
    icon: IconCampfire,
  },
  {
    name: "Logs",
    path: "/logs",
    icon: IconArrowsRightLeft,
  },
  {
    name: "Personas",
    path: "/personas",
    icon: IconCurrentLocation,
    badge: {
      text: "Coming",
      variant: "coming"
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
