
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface NotificationSectionProps {
  title: string;
  children: ReactNode;
  showHeaders?: boolean;
}

const NotificationSection = ({ 
  title, 
  children, 
  showHeaders = true 
}: NotificationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {showHeaders && (
        <div className="grid grid-cols-[1fr_100px_100px_100px] items-center pb-2">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Notification type</span>
          </div>
          <div className="flex justify-center">
            <Label className="text-xs text-center text-muted-foreground">Web</Label>
          </div>
          <div className="flex justify-center">
            <Label className="text-xs text-center text-muted-foreground">Email</Label>
          </div>
          <div className="flex justify-center">
            <Label className="text-xs text-center text-muted-foreground">Text</Label>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default NotificationSection;
