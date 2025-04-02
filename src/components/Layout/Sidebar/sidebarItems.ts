
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
  },
  {
    name: "Settings",
    path: "/account",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
