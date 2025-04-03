
import { useState } from "react";
import { Donation } from "@/types/donation";
import TableSearch from "./TableSearch";
import DownloadCSV from "./DownloadCSV";
import DonationsTableContent from "./DonationsTableContent";
import TablePagination from "./TablePagination";

interface DonationsTableProps {
  donations: Donation[];
}

const DonationsTable = ({ donations }: DonationsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const filteredDonations = donations.filter(
    (donation) =>
      donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-800">
        <TableSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <DownloadCSV donations={filteredDonations} />
      </div>
      
      <DonationsTableContent donations={paginatedDonations} />
      
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredDonations.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DonationsTable;
