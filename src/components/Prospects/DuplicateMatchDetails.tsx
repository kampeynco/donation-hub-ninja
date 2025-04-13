import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUsersGroup,
  IconMail,
  IconPhone,
  IconMap,
  IconCalendar,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useDuplicates } from "@/hooks/useDuplicates";
import { formatDate } from "@/lib/utils";
import type { DuplicateMatch, Contact } from "@/types/contact";
import { Skeleton } from "@/components/ui/skeleton";

interface DuplicateMatchDetailsProps {
  duplicate: DuplicateMatch;
  open: boolean;
  onClose: () => void;
}

export default function DuplicateMatchDetails({
  duplicate,
  open,
  onClose,
}: DuplicateMatchDetailsProps) {
  const { fetchDuplicateContacts, resolveDuplicate, isResolving } = useDuplicates();
  const [contacts, setContacts] = useState<{contact1: Contact | null, contact2: Contact | null}>({
    contact1: null,
    contact2: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadContacts = async () => {
      if (open && duplicate) {
        setIsLoading(true);
        try {
          const result = await fetchDuplicateContacts(duplicate);
          setContacts(result);
          
          // Default to the most complete contact
          if (result.contact1 && result.contact2) {
            const contact1Score = scoreContactCompleteness(result.contact1);
            const contact2Score = scoreContactCompleteness(result.contact2);
            setSelectedContactId(contact1Score >= contact2Score ? result.contact1.id : result.contact2.id);
          }
        } catch (error) {
          console.error("Error loading duplicate contacts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadContacts();
  }, [duplicate, fetchDuplicateContacts, open]);

  // Handle resolution actions
  const handleIgnore = async () => {
    await resolveDuplicate({
      duplicateId: duplicate.id,
      action: 'ignore'
    });
    onClose();
  };

  const handleMerge = async () => {
    if (!selectedContactId) return;
    
    await resolveDuplicate({
      duplicateId: duplicate.id,
      action: 'merge',
      primaryContactId: selectedContactId
    });
    onClose();
  };

  // Score contact completeness to suggest the best one to keep
  const scoreContactCompleteness = (contact: Contact): number => {
    let score = 0;
    if (contact.first_name) score += 1;
    if (contact.last_name) score += 1;
    if (contact.emails?.length) score += contact.emails.length;
    if (contact.phones?.length) score += contact.phones.length;
    if (contact.locations?.length) score += contact.locations.length;
    if (contact.status === 'donor') score += 3;
    else if (contact.status === 'active') score += 1;
    return score;
  };

  // Get confidence color based on score
  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return "text-gray-500";
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <IconUsersGroup className="h-5 w-5" />
            Duplicate Match Details
          </SheetTitle>
          <SheetDescription>
            Review and resolve potential duplicate contacts
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium">Match Confidence</h3>
            <div className="flex items-center mt-1">
              <Badge className={`${getScoreColor(duplicate.confidence_score)} bg-opacity-15`}>
                {duplicate.confidence_score}% Overall
              </Badge>
              <span className="mx-2 text-gray-400">•</span>
              <span className={`text-sm ${getScoreColor(duplicate.name_score)}`}>
                Name: {duplicate.name_score || 0}%
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className={`text-sm ${getScoreColor(duplicate.email_score)}`}>
                Email: {duplicate.email_score || 0}%
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Found on {formatDate(duplicate.created_at)}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              <h3 className="font-medium mb-2">Select primary contact to keep:</h3>
              
              <RadioGroup
                value={selectedContactId || undefined}
                onValueChange={setSelectedContactId}
                className="space-y-4"
              >
                {/* Contact 1 */}
                {contacts.contact1 && (
                  <div className={`border rounded-lg p-0 overflow-hidden ${selectedContactId === contacts.contact1.id ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader className="bg-gray-50 dark:bg-gray-900 p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <RadioGroupItem value={contacts.contact1.id} id={`contact-${contacts.contact1.id}`} />
                            <Label htmlFor={`contact-${contacts.contact1.id}`} className="font-medium text-base cursor-pointer">
                              {contacts.contact1.first_name || contacts.contact1.last_name ? 
                                `${contacts.contact1.first_name || ''} ${contacts.contact1.last_name || ''}`.trim() : 
                                'Contact 1'}
                            </Label>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Badge variant={contacts.contact1.status === 'donor' ? 'default' : 'outline'}>
                              {contacts.contact1.status.charAt(0).toUpperCase() + contacts.contact1.status.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Created {formatDate(contacts.contact1.created_at)}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      {contacts.contact1.emails?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconMail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{contacts.contact1.emails[0].email}</span>
                          {contacts.contact1.emails[0].is_primary && (
                            <Badge variant="outline" className="text-xs py-0">Primary</Badge>
                          )}
                        </div>
                      )}
                      {contacts.contact1.phones?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconPhone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{contacts.contact1.phones[0].phone}</span>
                          {contacts.contact1.phones[0].is_primary && (
                            <Badge variant="outline" className="text-xs py-0">Primary</Badge>
                          )}
                        </div>
                      )}
                      {contacts.contact1.locations?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconMap className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {[
                              contacts.contact1.locations[0].street,
                              contacts.contact1.locations[0].city,
                              contacts.contact1.locations[0].state,
                              contacts.contact1.locations[0].zip,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </div>
                )}
                
                {/* Contact 2 */}
                {contacts.contact2 && (
                  <div className={`border rounded-lg p-0 overflow-hidden ${selectedContactId === contacts.contact2.id ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader className="bg-gray-50 dark:bg-gray-900 p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <RadioGroupItem value={contacts.contact2.id} id={`contact-${contacts.contact2.id}`} />
                            <Label htmlFor={`contact-${contacts.contact2.id}`} className="font-medium text-base cursor-pointer">
                              {contacts.contact2.first_name || contacts.contact2.last_name ? 
                                `${contacts.contact2.first_name || ''} ${contacts.contact2.last_name || ''}`.trim() : 
                                'Contact 2'}
                            </Label>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Badge variant={contacts.contact2.status === 'donor' ? 'default' : 'outline'}>
                              {contacts.contact2.status.charAt(0).toUpperCase() + contacts.contact2.status.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Created {formatDate(contacts.contact2.created_at)}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      {contacts.contact2.emails?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconMail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{contacts.contact2.emails[0].email}</span>
                          {contacts.contact2.emails[0].is_primary && (
                            <Badge variant="outline" className="text-xs py-0">Primary</Badge>
                          )}
                        </div>
                      )}
                      {contacts.contact2.phones?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconPhone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{contacts.contact2.phones[0].phone}</span>
                          {contacts.contact2.phones[0].is_primary && (
                            <Badge variant="outline" className="text-xs py-0">Primary</Badge>
                          )}
                        </div>
                      )}
                      {contacts.contact2.locations?.[0] && (
                        <div className="flex items-center gap-2">
                          <IconMap className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {[
                              contacts.contact2.locations[0].street,
                              contacts.contact2.locations[0].city,
                              contacts.contact2.locations[0].state,
                              contacts.contact2.locations[0].zip,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </div>
                )}
              </RadioGroup>
            </>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleIgnore}
              disabled={isLoading || isResolving}
              className="gap-1"
            >
              <IconX className="h-4 w-4" /> Ignore Match
            </Button>
            <Button 
              onClick={handleMerge}
              disabled={!selectedContactId || isLoading || isResolving}
              className="gap-1"
            >
              <IconCheck className="h-4 w-4" /> Merge Selected
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
