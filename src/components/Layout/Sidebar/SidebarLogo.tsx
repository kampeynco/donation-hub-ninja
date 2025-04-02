
import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Logo mark images from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_dark.png";
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_light.png";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? LIGHT_LOGO_MARK : DARK_LOGO_MARK;

  return (
    <div className="p-4 flex items-center">
      <div className="bg-donor-blue text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
        <img src={logoSrc} alt="Donor Camp Logo" className="w-5 h-5" />
      </div>
      {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
