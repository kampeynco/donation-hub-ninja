
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="w-full max-w-6xl">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
