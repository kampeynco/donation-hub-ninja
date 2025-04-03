
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  label?: string;
}

const RefreshButton = ({ onRefresh, label = "Refresh data" }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Add slight delay to prevent flickering
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-9 px-3"
        >
          <IconRefresh 
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Update dashboard with latest data</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RefreshButton;
