
import React from "react";

// Logo mark image from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_light.png";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  return (
    <div className="p-4 flex items-center">
      <div className="bg-donor-blue text-white p-2 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
        <img src={LIGHT_LOGO_MARK} alt="Donor Camp Logo" className="w-6 h-6" />
      </div>
      {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
