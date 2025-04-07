
import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Logo mark images from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/donorcamp_logo_blue.png";
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/donorcamp_logo_white.png";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? DARK_LOGO_MARK : LIGHT_LOGO_MARK;

  return (
    <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : ''}`}>
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        <img src={logoSrc} alt="Donor Camp Logo" className="w-full h-full object-contain" />
      </div>
      {!collapsed && <span className="ml-3 font-semibold text-[1.75rem] flex items-center">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
