
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";

const Account = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>();
  
  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    // In a real app, you would upload the file to a server here
    console.log("Image changed, would upload in a real app");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-500">
        Manage your account information and webhook integration.
      </p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and organization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-6">
                <ImageUploader 
                  initialImage={profileImage} 
                  onImageChange={handleImageChange} 
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" defaultValue="Charity Foundation" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Integration</CardTitle>
              <CardDescription>
                Set up webhook endpoints to receive donation events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-service.com/webhook"
                    className="flex-1"
                  />
                  <Button variant="outline">Test</Button>
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a POST request to this URL whenever a donation is received.
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="font-medium">Webhook Secret</h3>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    defaultValue="1234567890"
                    className="flex-1"
                    readOnly
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-gray-500">
                  Use this secret to verify that requests are coming from DonorCamp.
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="font-medium">Events</h3>
                <p className="text-sm text-gray-500">
                  Select which events should trigger a webhook notification:
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="event-donation" defaultChecked />
                    <label htmlFor="event-donation">New donation</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="event-refund" defaultChecked />
                    <label htmlFor="event-refund">Refunded donation</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="event-recurring" defaultChecked />
                    <label htmlFor="event-recurring">Recurring donation</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="event-cancelled" defaultChecked />
                    <label htmlFor="event-cancelled">Cancelled recurring donation</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Integration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
