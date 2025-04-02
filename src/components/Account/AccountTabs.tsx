
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileTab from "./ProfileTab";
import IntegrationsTab from "./IntegrationsTab";
import NotificationsTab from "./NotificationsTab";
import BillingTab from "./BillingTab";

const AccountTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="integrations" className="space-y-6">
        <IntegrationsTab />
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-6">
        <NotificationsTab />
      </TabsContent>
      
      <TabsContent value="billing" className="space-y-6">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTabs;
