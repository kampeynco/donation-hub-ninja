
import React from "react";
import ContactsTabContent from "@/components/Prospects/ContactsTabContent";

export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prospects</h1>
        <p className="text-muted-foreground">Manage your contacts and prospects</p>
      </div>
      
      <ContactsTabContent />
    </div>
  );
}
