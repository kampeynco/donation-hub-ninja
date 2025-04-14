
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconUserCircle, IconUsersGroup, IconEye } from "@tabler/icons-react";
import { useContactStatus } from "@/hooks/useContactStatus";
import ContactsTabContent from "@/components/Prospects/ContactsTabContent";
import DuplicatesTabContent from "@/components/Prospects/DuplicatesTabContent";
import ProspectsNav from "@/components/Layout/NestedNav/ProspectsNav";
import { useLocation } from "react-router-dom";

const ProspectsPage = () => {
  const location = useLocation();
  const path = location.pathname;
  const activeTab = path === "/prospects/donors" ? "donors" : 
                   path === "/prospects/merge" ? "duplicates" : "contacts";

  const { statusCounts, recentDonors, isLoading } = useContactStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prospects</h1>
        <p className="text-muted-foreground">Manage your contacts, donors, and potential duplicates</p>
      </div>

      {/* Add the ProspectsNav component */}
      <ProspectsNav />

      <Tabs value={activeTab} className="w-full">
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
