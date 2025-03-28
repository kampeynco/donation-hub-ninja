
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BillingTab = () => {
  return (
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
  );
};

export default BillingTab;
