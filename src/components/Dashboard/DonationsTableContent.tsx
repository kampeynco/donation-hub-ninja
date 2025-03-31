
import { Donation } from "@/types/donation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowDown } from "@tabler/icons-react";

interface DonationsTableContentProps {
  donations: Donation[];
}

const DonationsTableContent = ({ donations }: DonationsTableContentProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <TableRow>
            <TableHead className="px-6 py-3 text-left font-medium cursor-pointer">
              DATE
              <IconArrowDown className="ml-1 inline-block h-4 w-4 text-gray-400" />
            </TableHead>
            <TableHead className="px-6 py-3 text-left font-medium">NAME</TableHead>
            <TableHead className="px-6 py-3 text-left font-medium">EMAIL</TableHead>
            <TableHead className="px-6 py-3 text-right font-medium">AMOUNT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 text-sm">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <TableRow key={donation.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4 text-gray-600">{donation.date}</TableCell>
                <TableCell className="px-6 py-4">{donation.name || "Anonymous"}</TableCell>
                <TableCell className="px-6 py-4 text-blue-500">{donation.email || "---"}</TableCell>
                <TableCell className="px-6 py-4 text-right font-medium">${donation.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No donations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationsTableContent;
