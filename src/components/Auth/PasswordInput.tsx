
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
  readOnly?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "••••••••••••",
  required = false,
  className = "",
  error = false,
  readOnly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className={`w-full pr-10 ${error ? "border-red-500" : ""} ${className}`}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
