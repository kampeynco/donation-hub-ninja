
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  IconAddressBook, IconHeartDollar, IconLayersDifference,
  IconUserCircle, IconBell, IconCreditCard,
  IconBellHeart, IconBellBolt, IconBellCog
} from "@tabler/icons-react";

interface SubSidebarItemProps {
  icon: string;
  path: string;
  label: string;
  isActive: boolean;
  className?: string;
}

export default function SubSidebarItem({
  icon,
  path,
  label,
  isActive,
  className,
}: SubSidebarItemProps) {
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
          <IconComponent className="mr-3 h-4 w-4" />
          <span>{label}</span>
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
    case "IconAddressBook":
      return IconAddressBook;
    case "IconHeartDollar":
      return IconHeartDollar;
    case "IconLayersDifference":
      return IconLayersDifference;
    case "IconUserCircle":
      return IconUserCircle;
    case "IconBell":
      return IconBell;
    case "IconCreditCard":
      return IconCreditCard;
    case "IconBellHeart":
      return IconBellHeart;
    case "IconBellBolt":
      return IconBellBolt;
    case "IconBellCog":
      return IconBellCog;
    default:
      return IconAddressBook;
  }
}
