
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IconUser } from "@tabler/icons-react";

const ProfileTab = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Set email from the authenticated user
      setEmail(user.email || "");
      
      // Try to fetch profile data if it exists
      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (data) {
            // Set profile data from database
            setFirstName(data.contact_first_name || "");
            setLastName(data.contact_last_name || "");
            setOrganization(data.committee_name || "");
            setMobilePhone(data.mobile_phone || "");
          }
        } catch (error) {
          console.error('Error in profile fetch:', error);
        }
      };
      
      fetchProfileData();
    }
  }, [user]);

  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    // In a real app, you would upload the file to a server here
    console.log("Image changed, would upload in a real app");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          committee_name: organization,
          contact_first_name: firstName.trim() || null,
          contact_last_name: lastName.trim() || null,
          mobile_phone: mobilePhone.trim() || null,
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

  // Get user initials for avatar fallback
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account details and organization information
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                onChange={(e) => setEmail(e.target.value)}
                disabled 
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="mobilePhone">Mobile Phone</Label>
              <Input 
                id="mobilePhone" 
                type="tel" 
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="Enter Mobile Phone Number"
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
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
