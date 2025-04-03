
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProfileFormProps {
  user: User | null;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  mobilePhone: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setOrganization: (value: string) => void;
  setMobilePhone: (value: string) => void;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  organization: string;
  mobilePhone: string;
}

const ProfileForm = ({
  user,
  firstName,
  lastName,
  email,
  organization,
  mobilePhone,
  setFirstName,
  setLastName,
  setOrganization,
  setMobilePhone,
}: ProfileFormProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      organization: organization,
      mobilePhone: mobilePhone,
    },
  });

  // Update form when props change
  const { reset } = form;
  useState(() => {
    reset({
      firstName,
      lastName,
      organization,
      mobilePhone,
    });
  });

  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    console.log("Image changed, would upload in a real app");
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const formattedPhone = values.mobilePhone.replace(/\D/g, "");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          committee_name: values.organization,
          contact_first_name: values.firstName.trim() || null,
          contact_last_name: values.lastName.trim() || null,
          mobile_phone: formattedPhone || null,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update parent state
      setFirstName(values.firstName);
      setLastName(values.lastName);
      setOrganization(values.organization);
      setMobilePhone(values.mobilePhone);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    
    if (!user || !user.email) return "UC";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <ImageUploader 
            initialImage={profileImage} 
            onImageChange={handleImageChange}
            initials={getUserInitials()}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={() => {}}
              disabled 
              className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:col-span-2">
                <FormLabel>Mobile Phone</FormLabel>
                <FormControl>
                  <PhoneInput 
                    id="mobilePhone"
                    placeholder="(555) 123-4567"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">Required for text message notifications</p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:col-span-2">
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter Organization Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
