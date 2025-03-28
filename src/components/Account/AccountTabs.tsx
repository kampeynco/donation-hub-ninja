
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileTab from "./ProfileTab";
import WebhooksTab from "./WebhooksTab";
import NotificationsTab from "./NotificationsTab";
import BillingTab from "./BillingTab";

const AccountTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="webhooks" className="space-y-6">
        <WebhooksTab />
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
