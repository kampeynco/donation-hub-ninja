
import { Card, CardContent } from "@/components/ui/card";

interface WebhookStatsProps {
  total: number;
  processed: number;
  errors: number;
}

const WebhookStats = ({ total, processed, errors }: WebhookStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <h3 className="mt-2 text-3xl font-bold">{total}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Processed</p>
            <h3 className="mt-2 text-3xl font-bold">{processed}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Errors</p>
            <h3 className="mt-2 text-3xl font-bold">{errors}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookStats;
