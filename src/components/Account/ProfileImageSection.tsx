
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

interface ProfileImageSectionProps {
  firstName: string;
  lastName: string;
  user: any;
}

const ProfileImageSection = ({ firstName, lastName, user }: ProfileImageSectionProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>();

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

  const handleImageChange = (_file: File, dataUrl: string) => {
    setProfileImage(dataUrl);
    console.log("Image changed, would upload in a real app");
  };

  return (
    <div className="flex justify-center mb-6">
      <ImageUploader 
        initialImage={profileImage} 
        onImageChange={handleImageChange}
        initials={getUserInitials()}
      />
    </div>
  );
};

export default ProfileImageSection;
