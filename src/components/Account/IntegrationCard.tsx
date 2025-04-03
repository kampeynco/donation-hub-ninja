
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={title}
                  className="h-[2.5rem] w-auto object-contain"
                />
              ) : (
                icon
              )}
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <button 
            onClick={onInstructionsClick}
            className="text-xs text-primary hover:underline"
          >
            Instructions
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
      </CardContent>
      
      <CardFooter className="p-0 border-t dark:border-gray-700">
        <Button 
          onClick={onConnectClick} 
          variant={connected ? "default" : "default"} 
          className="w-full rounded-none h-12 bg-donor-blue hover:bg-donor-blue/90 text-white border-0"
        >
          {connected ? "Configure" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
