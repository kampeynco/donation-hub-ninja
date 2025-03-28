
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Donation } from "@/types/donation";
import { toast } from "@/components/ui/use-toast";

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

  const downloadCSV = () => {
    try {
      // Create CSV header row
      const headers = ["Date", "Name", "Email", "Amount"];
      
      // Convert donation data to CSV rows
      const csvRows = [
        headers.join(","),
        ...filteredDonations.map(d => 
          [
            d.date, 
            d.name ? `"${d.name}"` : "Anonymous", 
            d.email ? `"${d.email}"` : "---", 
            d.amount
          ].join(",")
        )
      ];
      
      // Create blob and download link
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger click
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `donations-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Donations CSV downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        title: "Error",
        description: "Failed to download donations CSV",
        variant: "destructive"
      });
    }
  };

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
        <Button variant="outline" size="sm" onClick={downloadCSV}>
          Download CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left font-medium cursor-pointer">
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
              <th className="px-6 py-3 text-left font-medium">NAME</th>
              <th className="px-6 py-3 text-left font-medium">EMAIL</th>
              <th className="px-6 py-3 text-right font-medium">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {paginatedDonations.length > 0 ? (
              paginatedDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{donation.date}</td>
                  <td className="px-6 py-4">{donation.name || "Anonymous"}</td>
                  <td className="px-6 py-4 text-blue-500">{donation.email || "---"}</td>
                  <td className="px-6 py-4 text-right font-medium">${donation.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t p-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredDonations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
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
