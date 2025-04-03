
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { IconChartArea } from "@tabler/icons-react";

interface ChartData {
  name: string;
  amount: number;
}

interface DonationsSummaryChartProps {
  data: ChartData[];
  isLoading: boolean;
  title?: string;
  height?: number;
}

const DonationsSummaryChart = ({ 
  data, 
  isLoading, 
  title = "Donation Trends", 
  height = 300 
}: DonationsSummaryChartProps) => {
  // Format the currency in the tooltip
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-donor-blue font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <IconChartArea className="mr-2 h-5 w-5 text-donor-blue" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <IconChartArea className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No donation data available to display</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#888888' }}
                  tickMargin={10}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#888888' }}
                  tickMargin={10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#007AFF" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationsSummaryChart;
