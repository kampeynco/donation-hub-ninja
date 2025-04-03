
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const TableSearch = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search donors or emails" 
}: TableSearchProps) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // Update local state when prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchTerm) {
        onSearchChange(inputValue);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange, searchTerm]);
  
  // Clear search
  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="relative w-full sm:w-64">
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-9 pr-9 w-full"
      />
      <IconSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        size={16}
      />
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 hover:text-gray-700"
          onClick={handleClear}
        >
          <IconX size={14} />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};

export default TableSearch;
