
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingRowsProps {
  count?: number;
}

const LoadingRows = ({ count = 5 }: LoadingRowsProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[150px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default LoadingRows;
