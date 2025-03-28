
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
    <div className={cn("stat-card flex flex-col justify-between", className)}>
      <div className="text-xs opacity-80">{subtitle}</div>
      <div className="my-2 text-3xl font-semibold">{value}</div>
      <div className="text-sm font-medium">{title}</div>
      {children}
    </div>
  );
};

export default StatCard;
