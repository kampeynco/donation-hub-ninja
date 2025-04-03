
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

interface TableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TableSearch = ({ searchTerm, onSearchChange }: TableSearchProps) => {
  return (
    <div className="relative w-64">
      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8 w-full"
      />
      <IconSearch
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
        size={16}
      />
    </div>
  );
};

export default TableSearch;
