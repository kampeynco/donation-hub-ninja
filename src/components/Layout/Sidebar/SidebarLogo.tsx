
import React from "react";
import { IconStarFilled } from "@tabler/icons-react";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  return (
    <div className="p-4 flex items-center">
      <div className="bg-donor-blue text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
        <IconStarFilled size={16} />
      </div>
      {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
