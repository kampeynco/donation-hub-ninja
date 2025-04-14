
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturesLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2].map((item) => (
        <div key={item} className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
        </div>
      ))}
    </div>
  );
};

export default FeaturesLoading;
