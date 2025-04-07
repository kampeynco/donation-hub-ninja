
import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Logo mark images from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/flame_logomark_blue.png";
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/flame_logomark_white.png";

interface SidebarLogoProps {
  collapsed: boolean;
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? DARK_LOGO_MARK : LIGHT_LOGO_MARK;

  return (
    <div className="p-4 flex items-center">
      <div className="w-[2.8rem] h-[2.8rem] flex items-center justify-center shrink-0">
        <img src={logoSrc} alt="Donor Camp Logo" className="w-full h-full" />
      </div>
      {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
    </div>
  );
};

export default SidebarLogo;
