
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconStarFilled } from "@tabler/icons-react";

const Donors = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Donors Universe</h1>
        <p className="text-muted-foreground">Analyze and segment your donors</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconStarFilled className="h-5 w-5 text-yellow-500" />
            <CardTitle>Beta Feature</CardTitle>
          </div>
          <CardDescription>
            The Donors Universe feature is currently in beta. Access is limited.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This feature allows you to segment and analyze your donors based on various criteria
            such as giving frequency, amount, and engagement level.
          </p>
          <Button>Request Access</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Donors;
