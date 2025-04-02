
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
}

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
    }
  },
  {
    name: "Settings",
    path: "/account",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
