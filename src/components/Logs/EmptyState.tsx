
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface EmptyStateProps {
  message: string;
  colSpan?: number;
  isError?: boolean;
}

const EmptyState = ({ message, colSpan = 4, isError = false }: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={`text-center py-6 ${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
        {message}
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
