
import React from "react";
import { WaitlistStatus } from "@/services/waitlistService";

interface FeatureStatusBadgeProps {
  status: WaitlistStatus;
}

export const FeatureStatusBadge: React.FC<FeatureStatusBadgeProps> = ({ status }) => {
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
    <span className={`text-sm ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};
