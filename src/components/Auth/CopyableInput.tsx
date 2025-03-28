
import React from "react";
import { Input } from "@/components/ui/input";
import { IconCopy } from "@tabler/icons-react";

interface CopyableInputProps {
  id: string;
  value: string;
  label?: string;
  className?: string;
  readOnly?: boolean;
}

const CopyableInput: React.FC<CopyableInputProps> = ({
  id,
  value,
  label,
  className = "",
  readOnly = true,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          readOnly={readOnly}
          className={`w-full pr-10 ${className}`}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => copyToClipboard(value)}
        >
          <IconCopy size={20} />
        </button>
      </div>
    </div>
  );
};

export default CopyableInput;
