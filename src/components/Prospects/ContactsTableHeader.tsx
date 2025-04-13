
import React from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

interface ContactsTableHeaderProps {
  totalContacts: number;
  onCreateClick: () => void;
}

export default function ContactsTableHeader({ totalContacts, onCreateClick }: ContactsTableHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Contacts</h2>
        <p className="text-sm text-gray-500">{totalContacts} total contacts</p>
      </div>
      <Button onClick={onCreateClick} className="gap-1">
        <IconPlus className="h-4 w-4" /> New Contact
      </Button>
    </div>
  );
}
