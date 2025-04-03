
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, subtitle, className, children, icon }: StatCardProps) => {
  return (
    <div className={cn("stat-card flex flex-col justify-between rounded-xl p-6", className)}>
      <div className="text-xs font-medium uppercase tracking-wider opacity-85">{subtitle}</div>
      <div className="my-3 text-4xl font-bold">{value}</div>
      <div className="flex items-center gap-2">
        {icon && <span className="opacity-85">{icon}</span>}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default StatCard;
