
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  organization: string;
  mobilePhone: string;
}

interface UseProfileFormProps {
  user: User | null;
  firstName: string;
  lastName: string;
  organization: string;
  mobilePhone: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setOrganization: (value: string) => void;
  setMobilePhone: (value: string) => void;
}

export const useProfileForm = ({
  user,
  firstName,
  lastName,
  organization,
  mobilePhone,
  setFirstName,
  setLastName,
  setOrganization,
  setMobilePhone,
}: UseProfileFormProps) => {
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
  form.reset({
    firstName,
    lastName,
    organization,
    mobilePhone,
  });

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

  return {
    form,
    loading,
    onSubmit,
  };
};
