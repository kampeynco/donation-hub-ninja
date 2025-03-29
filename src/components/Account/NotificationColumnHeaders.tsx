
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const NotificationColumnHeaders = () => {
  return (
    <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
      <div className="col-span-1"></div>
      <div className="text-sm font-medium text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">Web</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Receive notifications in the web application</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm font-medium text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">Email</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Receive notifications via email</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm font-medium text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">Text</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Receive notifications via SMS</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NotificationColumnHeaders;
