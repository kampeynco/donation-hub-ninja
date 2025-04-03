
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationsTab from "@/components/Account/IntegrationsTab";

const Connections = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground mt-2">
          Manage your integrations and external connections
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Connections</CardTitle>
          <CardDescription>
            Connect your Donor Camp account with third-party services
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="integrations" className="px-6 pb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>
          <TabsContent value="webhooks">
            <div className="mt-4">
              <iframe 
                src="/account?tab=webhooks" 
                title="Webhooks" 
                className="w-full h-[600px] border-0"
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Connections;
