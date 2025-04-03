
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PageLoader: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Page header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      
      {/* Content skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      
      {/* Table skeleton */}
      <Skeleton className="h-10 w-full mb-4 rounded-md" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
};
