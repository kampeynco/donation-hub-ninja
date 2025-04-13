
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  IconPlus, 
  IconUpload,
  IconUserPlus
} from "@tabler/icons-react";
import React from "react";

interface ContactsTableHeaderProps {
  totalContacts: number;
  onCreateClick: () => void;
  onImportClick: () => void;
}

export default function ContactsTableHeader({ 
  totalContacts,
  onCreateClick,
  onImportClick,
}: ContactsTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">All Contacts</h2>
        <p className="text-sm text-gray-500">{totalContacts} contacts total</p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5">
              <IconPlus className="h-4 w-4" />
              New Contact
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={onCreateClick} className="cursor-pointer gap-2">
              <IconUserPlus className="h-4 w-4" />
              <span>Add a Contact</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportClick} className="cursor-pointer gap-2">
              <IconUpload className="h-4 w-4" />
              <span>Import CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
