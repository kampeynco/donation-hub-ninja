
import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-gray-50 p-6 md:p-8 rounded-xl transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 md:mb-6">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
};

export default FeatureCard;
