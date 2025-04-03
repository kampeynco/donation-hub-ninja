
import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between rounded-xl p-6 bg-gray-50 dark:bg-gray-800">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-10 w-24 my-3" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
};

export default StatCardSkeleton;
