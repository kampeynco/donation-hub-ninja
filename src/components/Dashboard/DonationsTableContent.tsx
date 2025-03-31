
import { Donation } from "@/types/donation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconArrowDown } from "@tabler/icons-react";

interface DonationsTableContentProps {
  donations: Donation[];
}

const DonationsTableContent = ({ donations }: DonationsTableContentProps) => {
  // Function to render donation type badge
  const renderDonationTypeBadge = (donation: Donation) => {
    if (!donation.recurringPeriod || donation.recurringPeriod === 'once') {
      return <Badge variant="outline" className="bg-gray-100 whitespace-nowrap">One-time</Badge>;
    }

    // Recurring donation badge for Monthly or Weekly
    return <Badge className="bg-donor-green whitespace-nowrap">Recurring</Badge>;
  };

  // Function to render duration badge for recurring donations
  const renderDurationBadge = (donation: Donation) => {
    // Only show duration badge for recurring donations with a valid recurringPeriod
    if (!donation.recurringPeriod || donation.recurringPeriod === 'once') {
      return null; // No duration badge for one-time donations
    }

    // Infinite recurring donation
    if (donation.recurringDuration === 9999) {
      return <Badge variant="outline" className="bg-donor-blue text-white ml-2 whitespace-nowrap">Infinite</Badge>;
    }

    // Regular recurring donation with duration
    if (donation.recurringDuration && donation.recurringDuration > 0) {
      // Check for Monthly period
      if (donation.recurringPeriod.toLowerCase() === 'monthly') {
        return (
          <Badge variant="outline" className="bg-gray-100 ml-2 whitespace-nowrap">
            {donation.recurringDuration} {donation.recurringDuration === 1 ? 'Month' : 'Months'}
          </Badge>
        );
      }
      // Check for Weekly period
      else if (donation.recurringPeriod.toLowerCase() === 'weekly') {
        return (
          <Badge variant="outline" className="bg-gray-100 ml-2 whitespace-nowrap">
            {donation.recurringDuration} {donation.recurringDuration === 1 ? 'Week' : 'Weeks'}
          </Badge>
        );
      }
    }

    // Default badge for other recurring cases
    return <Badge variant="outline" className="bg-gray-100 ml-2 whitespace-nowrap">Recurring</Badge>;
  };

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
            <TableHead className="px-6 py-3 text-left font-medium">TYPE</TableHead>
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
                <TableCell className="px-6 py-4">
                  <div className="flex items-center flex-nowrap">
                    {renderDonationTypeBadge(donation)}
                    {renderDurationBadge(donation)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium">${donation.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
