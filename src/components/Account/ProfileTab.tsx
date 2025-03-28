
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";

const ProfileTab = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>();

  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    // In a real app, you would upload the file to a server here
    console.log("Image changed, would upload in a real app");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account details and organization information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center mb-6">
          <ImageUploader 
            initialImage={profileImage} 
            onImageChange={handleImageChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Doe" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" defaultValue="Charity Foundation" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
