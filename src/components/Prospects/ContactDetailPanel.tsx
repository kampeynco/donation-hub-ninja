import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  IconUserCircle,
  IconMail,
  IconPhone,
  IconMap,
  IconBriefcase,
  IconCreditCard,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useContact } from "@/hooks/useContact";
import { useContactPrimaryRecords } from "@/hooks/useContactPrimaryRecords";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact, Email, Phone, Location } from "@/types/contact";

interface ContactDetailPanelProps {
  contactId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ContactDetailPanel({
  contactId,
  open,
  onClose,
}: ContactDetailPanelProps) {
  const { contact, isLoading } = useContact(contactId || undefined);
  const { setPrimaryEmail, setPrimaryPhone, setPrimaryLocation } = useContactPrimaryRecords(contactId || undefined);

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'prospect':
        return <Badge variant="outline">Prospect</Badge>;
      case 'active':
        return <Badge variant="secondary">Active</Badge>;
      case 'donor':
        return <Badge className="bg-donor-green">Donor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Calculate total donations
  const totalDonations = contact?.donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;
  
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-2 pr-8">
          <SheetClose className="absolute top-4 right-4">
            <IconX className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
          
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <SheetTitle className="flex items-center gap-2 text-xl">
                <IconUserCircle className="h-5 w-5" />
                {contact?.first_name || contact?.last_name ? (
                  `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                ) : (
                  'Unnamed Contact'
                )}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                {getStatusBadge(contact?.status || 'prospect')}
                <span className="text-sm text-gray-500">
                  Added on {formatDate(contact?.created_at || '')}
                </span>
              </SheetDescription>
            </>
          )}
        </SheetHeader>
        
        {isLoading ? (
          <div className="py-8 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="info" className="py-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="donations">
                Donations {contact?.donations?.length ? `(${contact.donations.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="space-y-6">
                {/* Contact Emails */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center gap-1">
                      <IconMail className="h-4 w-4" /> Email Addresses
                    </h3>
                    <Button variant="ghost" size="sm">
                      <IconPlus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {contact?.emails?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No email addresses</p>
                  ) : (
                    <div className="space-y-2">
                      {contact?.emails?.map((email) => (
                        <EmailItem 
                          key={email.id} 
                          email={email} 
                          onSetPrimary={() => setPrimaryEmail(email.id)} 
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Contact Phones */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center gap-1">
                      <IconPhone className="h-4 w-4" /> Phone Numbers
                    </h3>
                    <Button variant="ghost" size="sm">
                      <IconPlus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {contact?.phones?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No phone numbers</p>
                  ) : (
                    <div className="space-y-2">
                      {contact?.phones?.map((phone) => (
                        <PhoneItem 
                          key={phone.id} 
                          phone={phone} 
                          onSetPrimary={() => setPrimaryPhone(phone.id)} 
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Contact Addresses */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center gap-1">
                      <IconMap className="h-4 w-4" /> Addresses
                    </h3>
                    <Button variant="ghost" size="sm">
                      <IconPlus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {contact?.locations?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No addresses</p>
                  ) : (
                    <div className="space-y-2">
                      {contact?.locations?.map((location) => (
                        <LocationItem 
                          key={location.id} 
                          location={location} 
                          onSetPrimary={() => setPrimaryLocation(location.id)} 
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {contact?.employer_data?.[0] && (
                  <>
                    <Separator />
                    
                    {/* Employment Info */}
                    <div>
                      <h3 className="font-medium flex items-center gap-1 mb-2">
                        <IconBriefcase className="h-4 w-4" /> Employment
                      </h3>
                      
                      <div className="rounded-md border p-3 space-y-1">
                        {contact.employer_data[0].occupation && (
                          <div className="text-sm">
                            <span className="font-medium">Occupation:</span>{" "}
                            {contact.employer_data[0].occupation}
                          </div>
                        )}
                        {contact.employer_data[0].employer && (
                          <div className="text-sm">
                            <span className="font-medium">Employer:</span>{" "}
                            {contact.employer_data[0].employer}
                          </div>
                        )}
                        {contact.employer_data[0].employer_city && (
                          <div className="text-sm">
                            <span className="font-medium">Location:</span>{" "}
                            {[
                              contact.employer_data[0].employer_city,
                              contact.employer_data[0].employer_state,
                              contact.employer_data[0].employer_country
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" className="gap-1">
                    <IconEdit className="h-4 w-4" /> Edit Contact
                  </Button>
                  <Button variant="destructive" className="gap-1">
                    <IconTrash className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="donations">
              <div className="space-y-4">
                {/* Donation Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Donation Summary</CardTitle>
                    <CardDescription>
                      All donations from this contact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(totalDonations)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Count</p>
                        <p className="text-2xl font-bold text-center">
                          {contact?.donations?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Latest</p>
                        <p className="text-lg font-medium">
                          {contact?.donations?.[0] ? formatDate(contact.donations[0].paid_at || '') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Donations list */}
                {contact?.donations?.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <IconCreditCard className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="mt-2 font-medium">No donations yet</p>
                    <p className="text-sm text-gray-500">This contact has not made any donations.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contact?.donations?.map((donation) => (
                      <Card key={donation.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{formatCurrency(donation.amount)}</CardTitle>
                            <Badge variant="outline">
                              {donation.recurring_period || 'One-time'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {formatDate(donation.paid_at || '')}
                          </CardDescription>
                        </CardHeader>
                        {(donation.committee_name || donation.contribution_form) && (
                          <CardContent className="pb-2 pt-0 text-sm">
                            {donation.committee_name && (
                              <p>Committee: {donation.committee_name}</p>
                            )}
                            {donation.contribution_form && (
                              <p>Form: {donation.contribution_form}</p>
                            )}
                          </CardContent>
                        )}
                        <CardFooter className="text-xs text-gray-500">
                          Order #{donation.order_number || 'Unknown'}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="py-8 text-center border rounded-md">
                <IconClock className="h-10 w-10 mx-auto text-gray-300" />
                <p className="mt-2 font-medium">Activity History</p>
                <p className="text-sm text-gray-500 mx-auto max-w-sm">
                  Contact activity history will be available in a future update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Email list item component
function EmailItem({ email, onSetPrimary }: { email: Email, onSetPrimary: () => void }) {
  return (
    <div className="flex justify-between items-center p-2 border rounded-md">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{email.email}</span>
          {email.is_primary && (
            <Badge variant="secondary" className="text-xs py-0">Primary</Badge>
          )}
          {email.verified && (
            <Badge variant="outline" className="text-xs py-0 border-green-500 text-green-600">
              Verified
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Type: {email.type.charAt(0).toUpperCase() + email.type.slice(1)}
        </div>
      </div>
      <div>
        {!email.is_primary && (
          <Button variant="ghost" size="sm" onClick={onSetPrimary}>
            Set Primary
          </Button>
        )}
      </div>
    </div>
  );
}

// Phone list item component
function PhoneItem({ phone, onSetPrimary }: { phone: Phone, onSetPrimary: () => void }) {
  return (
    <div className="flex justify-between items-center p-2 border rounded-md">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{phone.phone}</span>
          {phone.is_primary && (
            <Badge variant="secondary" className="text-xs py-0">Primary</Badge>
          )}
          {phone.verified && (
            <Badge variant="outline" className="text-xs py-0 border-green-500 text-green-600">
              Verified
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Type: {phone.type.charAt(0).toUpperCase() + phone.type.slice(1)}
        </div>
      </div>
      <div>
        {!phone.is_primary && (
          <Button variant="ghost" size="sm" onClick={onSetPrimary}>
            Set Primary
          </Button>
        )}
      </div>
    </div>
  );
}

// Location list item component
function LocationItem({ location, onSetPrimary }: { location: Location, onSetPrimary: () => void }) {
  const correctedLocation = {
    ...location,
    type: location.type === 'main' ? 'home' : location.type
  };

  return (
    <div className="flex justify-between items-center p-2 border rounded-md">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">
            {[
              correctedLocation.street,
              correctedLocation.city,
              correctedLocation.state,
              correctedLocation.zip
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
          {correctedLocation.is_primary && (
            <Badge variant="secondary" className="text-xs py-0">Primary</Badge>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Type: {correctedLocation.type.charAt(0).toUpperCase() + correctedLocation.type.slice(1)}
          {correctedLocation.country && ` • Country: ${correctedLocation.country}`}
        </div>
      </div>
      <div>
        {!correctedLocation.is_primary && (
          <Button variant="ghost" size="sm" onClick={onSetPrimary}>
            Set Primary
          </Button>
        )}
      </div>
    </div>
  );
}

// Need to define these icons specifically for this component
function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
