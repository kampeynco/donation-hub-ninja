
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DonationsTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-800">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="px-6 py-3 text-left font-medium">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-3 text-right font-medium">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="border-t p-4 flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
};

export default DonationsTableSkeleton;
