
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Editor = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Form Editor</h1>
      <p className="text-gray-500">
        Customize your donation form to match your brand and collect the information you need.
      </p>

      <Tabs defaultValue="design">
        <TabsList>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Design</CardTitle>
              <CardDescription>
                Customize the appearance of your donation form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">
                Editor functionality will be implemented in future updates. This will allow you to change colors, fonts, and layouts of your donation form.
              </p>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fields" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>
                Add, edit, or remove fields from your donation form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Field editor will be implemented in future updates. This will allow you to customize what information you collect from donors.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>
                Configure behavior and integration settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Settings editor will be implemented in future updates. This will allow you to set up webhooks, email notifications, and other integration options.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Editor;
