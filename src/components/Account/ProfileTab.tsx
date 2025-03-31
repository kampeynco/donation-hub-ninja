
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { IconUser } from "@tabler/icons-react";

const ProfileTab = () => {
  const { user, deleteAccount } = useAuth();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State for account deletion
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Strip formatting before saving to the database
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(deleteReason);
      // The redirect happens in the AuthContext, so we don't need to handle it here
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Account deletion failed",
        description: error.message || "There was an error deleting your account.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
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
          <div className="flex justify-between items-center">
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-destructive px-0 hover:no-underline"
                >
                  Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-4 my-4">
                  <Label htmlFor="delete-reason" className="font-medium">
                    Please tell us why you're leaving:
                  </Label>
                  <RadioGroup 
                    value={deleteReason} 
                    onValueChange={setDeleteReason}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_longer_needed" id="no_longer_needed" />
                      <Label htmlFor="no_longer_needed">I no longer need this service</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="too_complicated" id="too_complicated" />
                      <Label htmlFor="too_complicated">It's too complicated to use</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="found_alternative" id="found_alternative" />
                      <Label htmlFor="found_alternative">I found a better alternative</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="data_privacy" id="data_privacy" />
                      <Label htmlFor="data_privacy">Data privacy concerns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other reason</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="confirm-delete" className="font-medium">
                      Type DELETE to confirm deletion:
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      placeholder="DELETE"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || !deleteReason || confirmDelete !== "DELETE"}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
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
