
import { 
  IconDashboard, 
  IconUsers, 
  IconCreditCard, 
  IconReportMoney 
} from "@tabler/icons-react";

export interface SidebarItemType {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItemType[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: IconDashboard,
  },
  {
    name: "Donors",
    path: "/donors",
    icon: IconUsers,
  },
  {
    name: "Donations",
    path: "/donations",
    icon: IconCreditCard,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: IconReportMoney,
  },
];

export default sidebarItems;
