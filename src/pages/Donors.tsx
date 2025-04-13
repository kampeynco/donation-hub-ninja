import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconUserCircle, IconUsersGroup, IconEye } from "@tabler/icons-react";
import { useContactStatus } from "@/hooks/useContactStatus";
import ContactsTabContent from "@/components/Prospects/ContactsTabContent";
import DuplicatesTabContent from "@/components/Prospects/DuplicatesTabContent";

const ProspectsPage = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const { statusCounts, recentDonors, isLoading } = useContactStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prospects</h1>
        <p className="text-muted-foreground">Manage your contacts, donors, and potential duplicates</p>
      </div>

      <Tabs defaultValue="contacts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="contacts" className="gap-1.5">
            <IconUserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs px-2">
              {isLoading ? "..." : statusCounts.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="donors" className="gap-1.5">
            <IconEye className="h-4 w-4" />
            <span className="hidden sm:inline">Active Donors</span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs px-2">
              {isLoading ? "..." : recentDonors}
            </span>
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="gap-1.5">
            <IconUsersGroup className="h-4 w-4" />
            <span className="hidden sm:inline">Duplicates</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactsTabContent />
        </TabsContent>
        <TabsContent value="donors">
          {/* This will be implemented in the next iteration */}
          <div className="p-20 text-center border rounded-md bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-medium">Active Donors View</h3>
            <p className="text-sm text-gray-500 mt-2">
              This tab will show contacts who have made donations recently.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="duplicates">
          <DuplicatesTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProspectsPage;
