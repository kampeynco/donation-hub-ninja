
import { Donation } from "@/types/donation";

interface DonationsTableContentProps {
  donations: Donation[];
}

const DonationsTableContent = ({ donations }: DonationsTableContentProps) => {
  return (
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
          {donations.length > 0 ? (
            donations.map((donation) => (
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
  );
};

export default DonationsTableContent;
