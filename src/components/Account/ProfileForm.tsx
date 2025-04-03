
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@supabase/supabase-js";
import ProfileImageSection from "./ProfileImageSection";
import ProfileFormFields from "./ProfileFormFields";
import { useProfileForm } from "@/hooks/useProfileForm";

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
  const { form, loading, onSubmit } = useProfileForm({
    user,
    firstName,
    lastName,
    organization,
    mobilePhone,
    setFirstName,
    setLastName,
    setOrganization,
    setMobilePhone,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileImageSection 
          firstName={firstName}
          lastName={lastName}
          user={user}
        />
        
        <ProfileFormFields 
          form={form}
          email={email}
        />
        
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
