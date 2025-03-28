
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { IconRefresh, IconClipboard, IconArrowRight } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ImageUploader from "@/components/ImageUploader";
import CopyableInput from "@/components/Auth/CopyableInput";
import CopyablePasswordInput from "@/components/Auth/CopyablePasswordInput";
import { 
  WebhookCredentials, 
  fetchWebhookCredentials, 
  updateWebhookCredentials, 
  regenerateApiPassword,
  testWebhook,
  getWebhookEventStats
} from "@/services/webhookService";

const Account = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [webhookCredentials, setWebhookCredentials] = useState<WebhookCredentials | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingPassword, setIsRegeneratingPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [webhookStats, setWebhookStats] = useState({ total: 0, processed: 0, errors: 0 });
  
  useEffect(() => {
    const loadWebhookCredentials = async () => {
      const credentials = await fetchWebhookCredentials();
      if (credentials) {
        setWebhookCredentials(credentials);
        setWebhookUrl(credentials.endpoint_url);
      }
      
      const stats = await getWebhookEventStats();
      setWebhookStats(stats);
    };
    
    loadWebhookCredentials();
  }, []);
  
  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    // In a real app, you would upload the file to a server here
    console.log("Image changed, would upload in a real app");
  };
  
  const handleSaveWebhookUrl = async () => {
    if (!webhookCredentials) return;
    
    setIsLoading(true);
    try {
      const success = await updateWebhookCredentials(webhookCredentials.id, { 
        endpoint_url: webhookUrl 
      });
      
      if (success) {
        setWebhookCredentials({
          ...webhookCredentials,
          endpoint_url: webhookUrl
        });
        
        toast({
          title: "Webhook URL updated",
          description: "Your webhook endpoint has been updated successfully."
        });
      } else {
        throw new Error("Failed to update webhook URL");
      }
    } catch (error) {
      console.error("Error updating webhook URL:", error);
      toast({
        title: "Error updating webhook URL",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegeneratePassword = async () => {
    if (!webhookCredentials) return;
    
    setIsRegeneratingPassword(true);
    try {
      const newPassword = await regenerateApiPassword(webhookCredentials.id);
      
      if (newPassword) {
        setWebhookCredentials({
          ...webhookCredentials,
          api_password: newPassword
        });
        
        toast({
          title: "API Password regenerated",
          description: "Your new API password has been generated. Make sure to update your ActBlue webhook settings."
        });
      } else {
        throw new Error("Failed to regenerate API password");
      }
    } catch (error) {
      console.error("Error regenerating API password:", error);
      toast({
        title: "Error regenerating password",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingPassword(false);
    }
  };
  
  const handleTestWebhook = async () => {
    if (!webhookCredentials) return;
    
    setIsTesting(true);
    try {
      await testWebhook(webhookCredentials.id);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-500">
        Manage your account information and webhook integration.
      </p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
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
                Configure your ActBlue webhook integration to automatically sync donations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook Stats */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Total Events</p>
                      <h3 className="mt-2 text-3xl font-bold">{webhookStats.total}</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Processed</p>
                      <h3 className="mt-2 text-3xl font-bold">{webhookStats.processed}</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Errors</p>
                      <h3 className="mt-2 text-3xl font-bold">{webhookStats.errors}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Webhook Configuration */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">ActBlue Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhookUrl"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-actblue-webhook-url.com"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleSaveWebhookUrl}
                      disabled={isLoading || !webhookCredentials}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleTestWebhook}
                      disabled={isTesting || !webhookCredentials}
                    >
                      {isTesting ? "Testing..." : "Test"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This is where DonorCamp will send ActBlue donation data. Configure this in your ActBlue webhook settings.
                  </p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium">DonorCamp API Credentials</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Use these credentials in your ActBlue webhook settings to authenticate requests to DonorCamp.
                  </p>
                  
                  {webhookCredentials ? (
                    <div className="space-y-4">
                      <CopyableInput 
                        id="apiEndpoint" 
                        value="https://api.donorcamp.com/v1" 
                        label="API Endpoint" 
                      />
                      
                      <CopyableInput 
                        id="apiUsername" 
                        value={webhookCredentials.api_username} 
                        label="API Username" 
                      />
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="apiPassword">API Password</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleRegeneratePassword}
                            disabled={isRegeneratingPassword}
                            className="h-8 px-2 text-xs"
                          >
                            <IconRefresh size={16} className="mr-1" />
                            {isRegeneratingPassword ? "Regenerating..." : "Regenerate"}
                          </Button>
                        </div>
                        <CopyablePasswordInput 
                          id="apiPassword" 
                          value={webhookCredentials.api_password} 
                        />
                        <p className="text-xs text-gray-500">
                          For security reasons, we recommend regenerating your API password periodically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      Loading webhook credentials...
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium">ActBlue Integration Instructions</h3>
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-medium">Step 1: Access ActBlue Dashboard</h4>
                    <p className="text-sm text-gray-500">
                      Log into your ActBlue account and navigate to the Webhook settings section.
                    </p>
                    
                    <h4 className="font-medium">Step 2: Configure Webhook</h4>
                    <p className="text-sm text-gray-500">
                      Enter the DonorCamp API Endpoint, Username, and Password from above into ActBlue's webhook configuration.
                    </p>
                    
                    <h4 className="font-medium">Step 3: Select Events</h4>
                    <p className="text-sm text-gray-500">
                      Enable webhook notifications for donation events in ActBlue's settings.
                    </p>
                    
                    <h4 className="font-medium">Step 4: Test Integration</h4>
                    <p className="text-sm text-gray-500">
                      Use ActBlue's test feature to verify the webhook is properly configured.
                    </p>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <span>View ActBlue Integration Guide</span>
                        <IconArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-donations">Donation Received</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when a new donation is made
                      </p>
                    </div>
                    <input type="checkbox" id="email-donations" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive tips and updates about DonorCamp features
                      </p>
                    </div>
                    <input type="checkbox" id="email-marketing" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your donations and platform activity
                      </p>
                    </div>
                    <input type="checkbox" id="email-reports" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-all">All Activities</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications for all account activities
                        </p>
                      </div>
                      <input type="checkbox" id="push-all" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-mentioned">Mentions</Label>
                        <p className="text-sm text-muted-foreground">
                          Only when you're mentioned in comments
                        </p>
                      </div>
                      <input type="checkbox" id="push-mentioned" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">Professional Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99/month</p>
                      <p className="text-sm text-muted-foreground">Renews on May 15, 2023</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Change Plan</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Methods</h3>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="rounded-md bg-gray-100 p-2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">Default</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">Add Payment Method</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Billing History</h3>
                  
                  <div className="rounded-lg border">
                    <div className="flex justify-between items-center p-4 border-b">
                      <div>
                        <p className="font-medium">April 15, 2023</p>
                        <p className="text-sm text-muted-foreground">Professional Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$49.99</p>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Download</Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border-b">
                      <div>
                        <p className="font-medium">March 15, 2023</p>
                        <p className="text-sm text-muted-foreground">Professional Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$49.99</p>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Download</Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4">
                      <div>
                        <p className="font-medium">February 15, 2023</p>
                        <p className="text-sm text-muted-foreground">Professional Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$49.99</p>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Download</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
