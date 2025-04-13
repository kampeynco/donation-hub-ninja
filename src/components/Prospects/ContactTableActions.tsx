
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconUserCheck,
  IconCoin
} from "@tabler/icons-react";
import type { Contact } from "@/types/contact";

interface ContactTableActionsProps {
  contact: Contact;
}

export default function ContactTableActions({ contact }: ContactTableActionsProps) {
  // Actions for the contact
  const handleViewDetails = () => {
    // Open sliding panel with contact details
    console.log("View contact details", contact.id);
  };

  const handleEditContact = () => {
    // Open edit contact modal
    console.log("Edit contact", contact.id);
  };

  const handleDeleteContact = () => {
    // Open delete confirmation dialog
    console.log("Delete contact", contact.id);
  };

  const handleMarkAsActive = () => {
    // Update contact status to active
    console.log("Mark as active", contact.id);
  };

  const handleMarkAsDonor = () => {
    // Update contact status to donor
    console.log("Mark as donor", contact.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
          <IconEye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditContact} className="cursor-pointer">
          <IconEdit className="h-4 w-4 mr-2" />
          Edit Contact
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {contact.status === 'prospect' && (
          <DropdownMenuItem onClick={handleMarkAsActive} className="cursor-pointer">
            <IconUserCheck className="h-4 w-4 mr-2" />
            Mark as Active
          </DropdownMenuItem>
        )}
        {(contact.status === 'prospect' || contact.status === 'active') && (
          <DropdownMenuItem onClick={handleMarkAsDonor} className="cursor-pointer">
            <IconCoin className="h-4 w-4 mr-2" />
            Mark as Donor
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDeleteContact} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete Contact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
