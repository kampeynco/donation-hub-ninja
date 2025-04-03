
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useProfileForm";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  email: string;
}

const ProfileFormFields = ({ form, email }: ProfileFormFieldsProps) => {
  return (
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
  );
};

export default ProfileFormFields;
