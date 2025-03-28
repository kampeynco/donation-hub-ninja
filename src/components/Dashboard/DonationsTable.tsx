
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Donation } from "@/types/donation";

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
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button variant="outline" size="sm">
          Download CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="donation-table">
          <thead>
            <tr>
              <th className="cursor-pointer">
                DATE
                <svg
                  className="ml-1 inline-block h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th className="text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDonations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="text-gray-600">{donation.date}</td>
                <td>{donation.name || "Anonymous"}</td>
                <td className="text-blue-500">{donation.email || "---"}</td>
                <td className="text-right font-medium">${donation.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t p-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredDonations.length)} of{" "}
          {filteredDonations.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(totalPages)}
                className="min-w-[2rem]"
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonationsTable;
