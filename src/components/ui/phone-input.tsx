
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Convert string to formatted phone number
    const formatPhoneNumber = (input: string): string => {
      // Strip all non-numeric characters
      const numbers = input.replace(/\D/g, "");
      
      // Limit to 10 digits
      const limitedNumbers = numbers.substring(0, 10);
      
      // Apply formatting based on length
      if (limitedNumbers.length < 4) {
        return limitedNumbers;
      } else if (limitedNumbers.length < 7) {
        return `(${limitedNumbers.substring(0, 3)}) ${limitedNumbers.substring(3)}`;
      } else {
        return `(${limitedNumbers.substring(0, 3)}) ${limitedNumbers.substring(
          3,
          6
        )}-${limitedNumbers.substring(6, 10)}`;
      }
    };

    // Get the raw value (numbers only) to maintain cursor position
    const getRawValue = (formattedValue: string): string => {
      return formattedValue.replace(/\D/g, "");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = getRawValue(inputValue);
      const formattedValue = formatPhoneNumber(rawValue);
      
      onChange(formattedValue);
    };

    return (
      <Input
        type="tel"
        className={cn(className)}
        value={formatPhoneNumber(value)}
        onChange={handleInputChange}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
