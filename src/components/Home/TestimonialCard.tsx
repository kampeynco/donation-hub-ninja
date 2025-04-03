
import React, { ReactNode } from "react";

interface TestimonialCardProps {
  icon: ReactNode;
  text: string;
}

const TestimonialCard = ({ icon, text }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-full max-w-xs transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
