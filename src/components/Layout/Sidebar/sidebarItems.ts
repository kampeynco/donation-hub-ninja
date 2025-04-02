
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
    path: "/donors",
    icon: IconArrowsRightLeft,
  },
  {
    name: "Personas",
    path: "/donations",
    icon: IconCurrentLocation,
  },
  {
    name: "Settings",
    path: "/reports",
    icon: IconAdjustments,
  },
];

export default sidebarItems;
