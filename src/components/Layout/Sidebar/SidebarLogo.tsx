
import React from "react";

// Logo mark image from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/dc_logomark_main.png";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  return (
    <div className="p-4 flex items-center">
      <div className="w-[2.8rem] h-[2.8rem] flex items-center justify-center shrink-0">
        <img src={LIGHT_LOGO_MARK} alt="Donor Camp Logo" className="w-full h-full" />
      </div>
      {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
