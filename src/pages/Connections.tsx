import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import IntegrationsTab from "@/components/Account/IntegrationsTab";
const Connections = () => {
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground mt-2">
          Manage your integrations and external connections
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          
          <CardDescription>
            Connect your Donor Camp account with third-party services
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <IntegrationsTab />
        </div>
      </Card>
    </div>;
};
export default Connections;