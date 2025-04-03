
import { useState } from "react";
import { Donation } from "@/types/donation";
import TableSearch from "./TableSearch";
import DownloadCSV from "./DownloadCSV";
import DonationsTableContent from "./DonationsTableContent";
import TablePagination from "./TablePagination";
import EmptyDonationsState from "./EmptyDonationsState";

interface DonationsTableProps {
  donations: Donation[];
}

const DonationsTable = ({ donations }: DonationsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter donations based on search term
  const filteredDonations = donations.filter(
    (donation) =>
      donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If no donations after search, show filtered empty state
  const isFiltered = searchTerm.length > 0;
  const noResults = filteredDonations.length === 0 && isFiltered;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Search and download section */}
      <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b dark:border-gray-800">
        <TableSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {donations.length > 0 && (
          <DownloadCSV donations={filteredDonations} />
        )}
      </div>
      
      {/* Conditional display: Empty state if no results from search */}
      {noResults ? (
        <EmptyDonationsState message={`No donations matching '${searchTerm}'`} />
      ) : (
        <>
          {/* Table content with donations */}
          <DonationsTableContent donations={paginatedDonations} />
          
          {/* Only show pagination if we have donations */}
          {filteredDonations.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDonations.length}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DonationsTable;
