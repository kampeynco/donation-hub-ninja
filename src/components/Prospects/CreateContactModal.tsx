
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMap,
  IconBuilding,
  IconCheck,
  IconCirclePlus,
  IconX
} from "@tabler/icons-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CreateContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const contactFormSchema = z.object({
  // Basic info
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  status: z.enum(["prospect", "active", "donor"]),

  // We'll use these as placeholders but handle multi-fields separately
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  employer: z.string().optional(),
  occupation: z.string().optional(),
});

export default function CreateContactModal({
  open,
  onClose,
  onSubmit,
  isSubmitting
}: CreateContactModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [emailList, setEmailList] = useState<{id: string, email: string, type: "personal" | "work" | "other", is_primary: boolean}[]>([]);
  const [phoneList, setPhoneList] = useState<{id: string, phone: string, type: "mobile" | "home" | "work" | "other", is_primary: boolean}[]>([]);
  const [tempEmail, setTempEmail] = useState("");
  const [tempEmailType, setTempEmailType] = useState<"personal" | "work" | "other">("personal");
  const [tempPhone, setTempPhone] = useState("");
  const [tempPhoneType, setTempPhoneType] = useState<"mobile" | "home" | "work" | "other">("mobile");
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      status: "prospect",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      employer: "",
      occupation: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof contactFormSchema>) => {
    const { email, phone, street, city, state, zip, employer, occupation, ...basicData } = values;
    
    // Prepare data structure for submission
    const contactData = {
      contactData: basicData,
      emails: emailList.length > 0 ? emailList : undefined,
      phones: phoneList.length > 0 ? phoneList : undefined,
      location: street || city || state || zip ? {
        street,
        city,
        state,
        zip,
        country: "US",
        type: "home" as const,
        is_primary: true
      } : undefined,
      employer_data: employer || occupation ? {
        employer,
        occupation
      } : undefined
    };
    
    onSubmit(contactData);
  };

  // Handle email management
  const addEmail = () => {
    if (!tempEmail) return;
    
    const newEmail = {
      id: crypto.randomUUID(),
      email: tempEmail,
      type: tempEmailType,
      is_primary: emailList.length === 0
    };
    
    setEmailList([...emailList, newEmail]);
    setTempEmail("");
  };

  const removeEmail = (id: string) => {
    const updatedEmails = emailList.filter(email => email.id !== id);
    
    // If we removed the primary, make the first one primary if it exists
    if (emailList.find(email => email.id === id)?.is_primary && updatedEmails.length > 0) {
      updatedEmails[0].is_primary = true;
    }
    
    setEmailList(updatedEmails);
  };

  const setPrimaryEmail = (id: string) => {
    const updatedEmails = emailList.map(email => ({
      ...email,
      is_primary: email.id === id
    }));
    
    setEmailList(updatedEmails);
  };

  // Handle phone management
  const addPhone = () => {
    if (!tempPhone) return;
    
    const newPhone = {
      id: crypto.randomUUID(),
      phone: tempPhone,
      type: tempPhoneType,
      is_primary: phoneList.length === 0
    };
    
    setPhoneList([...phoneList, newPhone]);
    setTempPhone("");
  };

  const removePhone = (id: string) => {
    const updatedPhones = phoneList.filter(phone => phone.id !== id);
    
    // If we removed the primary, make the first one primary if it exists
    if (phoneList.find(phone => phone.id === id)?.is_primary && updatedPhones.length > 0) {
      updatedPhones[0].is_primary = true;
    }
    
    setPhoneList(updatedPhones);
  };

  const setPrimaryPhone = (id: string) => {
    const updatedPhones = phoneList.map(phone => ({
      ...phone,
      is_primary: phone.id === id
    }));
    
    setPhoneList(updatedPhones);
  };

  // Reset the form when the modal closes
  const handleClose = () => {
    form.reset();
    setEmailList([]);
    setPhoneList([]);
    setActiveTab("basic");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="basic" className="gap-1.5">
                  <IconUser className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-1.5">
                  <IconMail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="gap-1.5">
                  <IconPhone className="h-4 w-4" />
                  <span className="hidden sm:inline">Phone</span>
                </TabsTrigger>
                <TabsTrigger value="address" className="gap-1.5">
                  <IconMap className="h-4 w-4" />
                  <span className="hidden sm:inline">Address</span>
                </TabsTrigger>
                <TabsTrigger value="work" className="gap-1.5">
                  <IconBuilding className="h-4 w-4" />
                  <span className="hidden sm:inline">Work</span>
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Contact Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prospect" id="prospect" />
                            <Label htmlFor="prospect">Prospect</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="active" />
                            <Label htmlFor="active">Active</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="donor" id="donor" />
                            <Label htmlFor="donor">Donor</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Addresses</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    {emailList.length === 0 ? (
                      <p className="text-sm text-gray-500">No email addresses added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {emailList.map(emailItem => (
                          <div key={emailItem.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{emailItem.email}</span>
                              <Badge variant="outline" className="text-xs">
                                {emailItem.type}
                              </Badge>
                              {emailItem.is_primary && (
                                <Badge className="bg-green-500 text-xs">Primary</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {!emailItem.is_primary && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setPrimaryEmail(emailItem.id)}
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => removeEmail(emailItem.id)}
                              >
                                <IconX className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="newEmail">Add Email</Label>
                      <Input 
                        id="newEmail" 
                        type="email" 
                        placeholder="Email address" 
                        value={tempEmail} 
                        onChange={e => setTempEmail(e.target.value)} 
                      />
                    </div>
                    <div className="w-[110px]">
                      <Label htmlFor="emailType">Type</Label>
                      <Select 
                        value={tempEmailType} 
                        onValueChange={(value: any) => setTempEmailType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={addEmail} className="flex-shrink-0">
                      <IconCirclePlus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Phone Tab */}
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone Numbers</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    {phoneList.length === 0 ? (
                      <p className="text-sm text-gray-500">No phone numbers added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {phoneList.map(phoneItem => (
                          <div key={phoneItem.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{phoneItem.phone}</span>
                              <Badge variant="outline" className="text-xs">
                                {phoneItem.type}
                              </Badge>
                              {phoneItem.is_primary && (
                                <Badge className="bg-green-500 text-xs">Primary</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {!phoneItem.is_primary && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setPrimaryPhone(phoneItem.id)}
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => removePhone(phoneItem.id)}
                              >
                                <IconX className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="newPhone">Add Phone</Label>
                      <PhoneInput
                        id="newPhone"
                        placeholder="Phone number"
                        value={tempPhone}
                        onChange={setTempPhone}
                      />
                    </div>
                    <div className="w-[110px]">
                      <Label htmlFor="phoneType">Type</Label>
                      <Select 
                        value={tempPhoneType} 
                        onValueChange={(value: any) => setTempPhoneType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={addPhone} className="flex-shrink-0">
                      <IconCirclePlus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Work Tab */}
              <TabsContent value="work" className="space-y-4">
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer</FormLabel>
                      <FormControl>
                        <Input placeholder="Employer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Contact"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
