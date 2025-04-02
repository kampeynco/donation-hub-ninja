
import React from "react";
import { 
  IconDashboard, 
  IconUsers, 
  IconCreditCard, 
  IconReportMoney 
} from "@tabler/icons-react";

export interface SidebarItemType {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItemType[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    name: "Donors",
    path: "/donors",
    icon: <IconUsers className="h-5 w-5" />,
  },
  {
    name: "Donations",
    path: "/donations",
    icon: <IconCreditCard className="h-5 w-5" />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <IconReportMoney className="h-5 w-5" />,
  },
];

export default sidebarItems;
