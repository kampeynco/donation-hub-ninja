
import React from "react";
import { Button } from "@/components/ui/button";
import { IconUserPlus } from "@tabler/icons-react";

interface ContactsEmptyStateProps {
  onCreateClick: () => void;
}

export default function ContactsEmptyState({ onCreateClick }: ContactsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="rounded-full bg-gray-100 p-3">
        <IconUserPlus className="h-10 w-10 text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">No contacts found</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Get started by creating your first contact or applying different search filters.
        </p>
      </div>
      <Button onClick={onCreateClick}>
        Create Contact
      </Button>
    </div>
  );
}
