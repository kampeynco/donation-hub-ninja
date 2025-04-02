
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  logoUrl?: string;
  onConnectClick: () => void;
  onInstructionsClick: () => void;
  connected?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  logoUrl,
  onConnectClick,
  onInstructionsClick,
  connected = false,
}) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={title}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                icon
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              onClick={onConnectClick} 
              variant={connected ? "outline" : "default"} 
              size="sm"
            >
              {connected ? "Configure" : "Connect"}
            </Button>
            <button 
              onClick={onInstructionsClick}
              className="text-xs text-primary hover:underline mt-1 text-center"
            >
              Instructions
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
