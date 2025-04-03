
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

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
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  
  // Generate array of page numbers to display
  useEffect(() => {
    const generateVisiblePages = () => {
      // For small number of pages, show all
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      // For current page near the start
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      }
      
      // For current page near the end
      if (currentPage >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        ];
      }
      
      // For current page in the middle
      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
      ];
    };
    
    setVisiblePages(generateVisiblePages());
  }, [currentPage, totalPages]);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    // This would need to be implemented in the parent component
    console.log('Page size change requested:', value);
  };

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border-t p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="text-sm text-gray-500">
        Showing {totalItems === 0 ? 0 : startItem} to {endItem} of {totalItems} entries
      </div>
      
      <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
        {/* First page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
        >
          <IconChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page number buttons - only show on tablet and above */}
        <div className="hidden md:flex items-center gap-1">
          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[2rem]"
            >
              {page}
            </Button>
          ))}
        </div>
        
        {/* Current page indicator - only show on mobile */}
        <span className="md:hidden text-sm">
          Page {currentPage} of {totalPages}
        </span>
        
        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          <IconChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Last page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          <IconChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
