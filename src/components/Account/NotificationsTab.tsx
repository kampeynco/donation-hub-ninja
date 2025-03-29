
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Account Notifications</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="col-span-1"></div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Email
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications via email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Text
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications via SMS</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Web
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications in the web application</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="space-y-0.5">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive tips and updates about DonorCamp features
                </p>
              </div>
              <div className="flex justify-center">
                <Checkbox id="email-marketing" defaultChecked />
              </div>
              <div className="flex justify-center">
                <Checkbox id="text-marketing" />
              </div>
              <div className="flex justify-center">
                <Checkbox id="web-marketing" defaultChecked />
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your account activity
                </p>
              </div>
              <div className="flex justify-center">
                <Checkbox id="email-reports" defaultChecked />
              </div>
              <div className="flex justify-center">
                <Checkbox id="text-reports" />
              </div>
              <div className="flex justify-center">
                <Checkbox id="web-reports" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="font-medium mb-4">ActBlue Notifications</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="col-span-1"></div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Email
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications via email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Text
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications via SMS</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm font-medium text-center flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        Web
                        <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receive notifications in the web application</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="space-y-0.5">
                <Label>Donation Received</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a notification when a new donation is made
                </p>
              </div>
              <div className="flex justify-center">
                <Checkbox id="email-donations" defaultChecked />
              </div>
              <div className="flex justify-center">
                <Checkbox id="text-donations" />
              </div>
              <div className="flex justify-center">
                <Checkbox id="web-donations" defaultChecked />
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
              <div className="space-y-0.5">
                <Label>Recurring Donations</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a notification when recurring donations are processed
                </p>
              </div>
              <div className="flex justify-center">
                <Checkbox id="email-recurring" defaultChecked />
              </div>
              <div className="flex justify-center">
                <Checkbox id="text-recurring" />
              </div>
              <div className="flex justify-center">
                <Checkbox id="web-recurring" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
