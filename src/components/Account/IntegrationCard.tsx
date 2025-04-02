
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
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={title}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                icon
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
            </div>
          </div>
          <Button 
            onClick={onConnectClick} 
            variant={connected ? "outline" : "default"} 
            size="sm"
          >
            {connected ? "Configure" : "Connect"}
          </Button>
        </div>
        
        <div className="pl-16">
          <p className="text-sm text-gray-500 mb-1">{description}</p>
          <button 
            onClick={onInstructionsClick}
            className="text-sm text-primary hover:underline"
          >
            Instructions
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
