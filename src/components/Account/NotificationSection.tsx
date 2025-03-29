
import { ReactNode } from "react";
import NotificationColumnHeaders from "./NotificationColumnHeaders";

interface NotificationSectionProps {
  title: string;
  showHeaders?: boolean;
  children: ReactNode;
}

const NotificationSection = ({ 
  title, 
  showHeaders = true, 
  children 
}: NotificationSectionProps) => {
  return (
    <div>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {showHeaders && <NotificationColumnHeaders />}
        {children}
      </div>
    </div>
  );
};

export default NotificationSection;
