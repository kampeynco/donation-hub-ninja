
import React, { useState } from "react";
import { useDuplicates } from "@/hooks/useDuplicates";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  IconUsersGroup, 
  IconMoodConfuzed,
  IconChevronRight,
  IconArrowUp,
  IconArrowDown 
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DuplicateMatchDetails from "./DuplicateMatchDetails";
import ContactsTablePagination from "./ContactsTablePagination";
import type { DuplicateMatch } from "@/types/contact";

export default function DuplicatesTabContent() {
  const {
    duplicates,
    totalDuplicates,
    page,
    setPage,
    limit,
    totalPages,
    isLoading,
    sortOrder,
    setSortOrder,
  } = useDuplicates();

  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateMatch | null>(null);

  // Get confidence score badge
  const getConfidenceBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-500">Very High ({score}%)</Badge>;
    } else if (score >= 75) {
      return <Badge className="bg-blue-500">High ({score}%)</Badge>;
    } else if (score >= 50) {
      return <Badge variant="secondary">Medium ({score}%)</Badge>;
    } else {
      return <Badge variant="outline">Low ({score}%)</Badge>;
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Potential Duplicates</h2>
          <p className="text-sm text-gray-500">{totalDuplicates} potential duplicates found</p>
        </div>
      </div>

      {/* Duplicates table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={toggleSortOrder} className="cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-1">
                  Match Score 
                  {sortOrder === 'asc' ? 
                    <IconArrowUp className="h-4 w-4" /> : 
                    <IconArrowDown className="h-4 w-4" />
                  }
                </div>
              </TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Found</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : duplicates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="rounded-full bg-gray-100 p-3">
                      <IconMoodConfuzed className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-medium">No duplicates found</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        No duplicate contacts matching your criteria were found.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              duplicates.map((duplicate) => (
                <TableRow key={duplicate.id}>
                  <TableCell>
                    {getConfidenceBadge(duplicate.confidence_score)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <IconUsersGroup className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Potential duplicate contacts</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {duplicate.name_score && `Name: ${duplicate.name_score}% match`}
                      {duplicate.email_score && `, Email: ${duplicate.email_score}% match`}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(duplicate.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDuplicate(duplicate)}
                      className="gap-1"
                    >
                      View <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {duplicates.length > 0 && (
        <ContactsTablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalDuplicates}
          itemsPerPage={limit}
        />
      )}

      {/* Duplicate details sliding panel */}
      {selectedDuplicate && (
        <DuplicateMatchDetails
          duplicate={selectedDuplicate}
          open={!!selectedDuplicate}
          onClose={() => setSelectedDuplicate(null)}
        />
      )}
    </div>
  );
}
