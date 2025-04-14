
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  IconHome, IconSearch, IconSettings, IconBell, IconUser, 
  IconCreditCard, IconAddressBook, IconHeartDollar, IconLayersDifference,
  IconUserCircle, IconBellHeart, IconBellBolt, IconBellCog,
  IconChevronRight
} from "@tabler/icons-react";

interface SidebarItemProps {
  icon: string;
  path: string;
  label: string;
  isActive: boolean;
  hasNestedItems?: boolean;
  className?: string;
}

export default function SidebarItem({
  icon,
  path,
  label,
  isActive,
  hasNestedItems = false,
  className,
}: SidebarItemProps) {
  // Map icon string to component
  const IconComponent = getIconComponent(icon);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={path}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
            isActive 
              ? "bg-primary/10 text-primary" 
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            className
          )}
        >
          <IconComponent className="mr-3 h-5 w-5" />
          <span className="flex-1">{label}</span>
          {hasNestedItems && (
            <IconChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isActive && "rotate-90"
            )} />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="border bg-white text-gray-900">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// Helper function to map string to icon component
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "IconHome":
      return IconHome;
    case "IconSearch":
      return IconSearch;
    case "IconSettings":
      return IconSettings;
    case "IconBell":
      return IconBell;
    case "IconUser":
      return IconUser;
    case "IconCreditCard":
      return IconCreditCard;
    case "IconAddressBook":
      return IconAddressBook;
    case "IconHeartDollar":
      return IconHeartDollar;
    case "IconLayersDifference":
      return IconLayersDifference;
    case "IconUserCircle":
      return IconUserCircle;
    case "IconBellHeart":
      return IconBellHeart;
    case "IconBellBolt":
      return IconBellBolt;
    case "IconBellCog":
      return IconBellCog;
    default:
      return IconHome;
  }
}
