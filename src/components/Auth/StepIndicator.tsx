
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; title: string }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {steps.map((step) => (
        <React.Fragment key={step.number}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === step.number ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            } font-medium`}
          >
            {step.number}
          </div>
          <span
            className={`font-medium ${
              currentStep === step.number ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {step.title}
          </span>
          {step.number < steps.length && (
            <div className="w-4 h-0.5 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
