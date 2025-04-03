
import React, { ReactNode } from "react";

interface TestimonialCardProps {
  icon: ReactNode;
  text: string;
}

const TestimonialCard = ({ icon, text }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 border border-gray-100 w-[234px] h-[60px] transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <p className="text-xs font-medium text-gray-800 line-clamp-2">{text}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
