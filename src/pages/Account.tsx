
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/Account/ProfileTab";
import NotificationsTab from "@/components/Account/NotificationsTab";
import BillingTab from "@/components/Account/BillingTab";
import WebhooksTab from "@/components/Account/WebhooksTab";
import FeaturesTab from "@/components/Account/FeaturesTab";
import SettingsNav from "@/components/Layout/NestedNav/SettingsNav";
import { useLocation } from 'react-router-dom';

const Account = () => {
  const location = useLocation();
  const path = location.pathname;
  const activeTab = path === "/account/notifications" ? "notifications" : 
                   path === "/account/billing" ? "billing" :
                   path === "/account/webhooks" ? "webhooks" : 
                   path === "/account/features" ? "features" : "profile";

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences, profile, and notification settings.</p>
      </div>

      <SettingsNav />

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="webhooks">
          <WebhooksTab />
        </TabsContent>
        <TabsContent value="features">
          <FeaturesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
