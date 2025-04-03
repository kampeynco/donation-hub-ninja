
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./ProfileTab";
import NotificationsTab from "./NotificationsTab";
import BillingTab from "./BillingTab";
import FeaturesTab from "./FeaturesTab";
import { useSearchParams } from "react-router-dom";

const AccountTabs = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";

  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full md:w-auto">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
      
      <TabsContent value="features">
        <FeaturesTab />
      </TabsContent>
      
      <TabsContent value="billing">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTabs;
