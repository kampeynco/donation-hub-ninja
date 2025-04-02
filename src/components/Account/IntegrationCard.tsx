
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCreditCard } from "@tabler/icons-react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onConnectClick: () => void;
  onInstructionsClick: () => void;
  connected?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  onConnectClick,
  onInstructionsClick,
  connected = false,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onInstructionsClick}
              className="text-sm text-primary hover:underline"
            >
              Instructions
            </button>
            <Button 
              onClick={onConnectClick} 
              variant={connected ? "outline" : "default"} 
              size="sm"
            >
              {connected ? "Configure" : "Connect"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
