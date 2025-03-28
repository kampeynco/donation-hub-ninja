
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  className?: string;
  children?: React.ReactNode;
}

const StatCard = ({ title, value, subtitle, className, children }: StatCardProps) => {
  return (
    <div className={cn("stat-card flex flex-col justify-between rounded-xl p-6", className)}>
      <div className="text-xs font-medium uppercase tracking-wider opacity-85">{subtitle}</div>
      <div className="my-3 text-4xl font-bold">{value}</div>
      <div className="text-sm font-medium">{title}</div>
      {children}
    </div>
  );
};

export default StatCard;
