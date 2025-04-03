
import React from "react";
import { IconStarFilled } from "@tabler/icons-react";
import { WaitlistStatus } from "@/services/waitlistService";

interface FeatureStatusBadgeProps {
  status: WaitlistStatus;
  beta?: boolean;
}

export const FeatureStatusBadge: React.FC<FeatureStatusBadgeProps> = ({ status, beta }) => {
  const getStatusText = (status: WaitlistStatus) => {
    if (status === "approved") return "Enabled";
    if (status === "joined") return "On waitlist";
    if (status === "rejected") return "Not eligible";
    if (status === "declined") return "Declined";
    return "Available";
  };

  const getStatusColor = (status: WaitlistStatus) => {
    if (status === "approved") return "text-green-600";
    if (status === "joined") return "text-blue-600";
    if (status === "rejected") return "text-red-600";
    if (status === "declined") return "text-gray-600";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center gap-2">
      {beta && (
        <span className="bg-donor-blue bg-opacity-10 text-donor-blue text-xs px-2 py-0.5 rounded-full flex items-center">
          <IconStarFilled size={10} className="mr-1" />
          Beta
        </span>
      )}
      <span className={`text-sm ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
    </div>
  );
};
