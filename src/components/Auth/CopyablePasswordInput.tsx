
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeOff, IconCopy } from "@tabler/icons-react";
import { toast } from "@/hooks/use-toast";

interface CopyablePasswordInputProps {
  id: string;
  value: string;
  label?: string;
  className?: string;
  copyMessage?: string;
}

const CopyablePasswordInput: React.FC<CopyablePasswordInputProps> = ({
  id,
  value,
  label,
  className = "",
  copyMessage = "Password copied to clipboard"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: copyMessage,
      duration: 2000,
    });
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
          type={showPassword ? "text" : "password"}
          value={value}
          readOnly
          className={`w-full pr-16 ${className}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
          <button
            type="button"
            className="text-gray-500 mr-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
          <button
            type="button"
            className="text-gray-500"
            onClick={() => copyToClipboard(value)}
          >
            <IconCopy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyablePasswordInput;
