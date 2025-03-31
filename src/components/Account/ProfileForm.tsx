
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

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
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    console.log("Image changed, would upload in a real app");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      const formattedPhone = mobilePhone.replace(/\D/g, "");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          committee_name: organization,
          contact_first_name: firstName.trim() || null,
          contact_last_name: lastName.trim() || null,
          mobile_phone: formattedPhone || null,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center mb-6">
        <ImageUploader 
          initialImage={profileImage} 
          onImageChange={handleImageChange}
          initials={getUserInitials()}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={() => {}}
            disabled 
            className="bg-gray-100"
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="mobilePhone">Mobile Phone</Label>
          <PhoneInput 
            id="mobilePhone"
            value={mobilePhone}
            onChange={setMobilePhone}
            placeholder="(555) 123-4567"
          />
          <p className="text-xs text-muted-foreground mt-1">Required for text message notifications</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="organization">Organization</Label>
          <Input 
            id="organization" 
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Enter Organization Name"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
