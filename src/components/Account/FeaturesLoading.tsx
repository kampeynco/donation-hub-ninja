
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturesLoading: React.FC = () => {
  return (
    <div className="py-4">
      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};
