
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: TablePaginationProps) => {
  if (totalItems === 0) return null;

  return (
    <div className="border-t p-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
        {totalItems} entries
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[2rem]"
            >
              {page}
            </Button>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="text-gray-500">...</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="min-w-[2rem]"
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
