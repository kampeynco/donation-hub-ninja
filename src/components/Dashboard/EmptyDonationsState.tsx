
import { IconHeartOff } from "@tabler/icons-react";

interface EmptyDonationsStateProps {
  message?: string;
}

const EmptyDonationsState = ({ message = "No donations found" }: EmptyDonationsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
        <IconHeartOff className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No donations yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {message}
      </p>
    </div>
  );
};

export default EmptyDonationsState;
