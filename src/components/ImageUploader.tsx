
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange?: (file: File, dataUrl: string) => void;
  className?: string;
}

const ImageUploader = ({ initialImage, onImageChange, className }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialImage);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      if (onImageChange) {
        onImageChange(file, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const initials = "JS"; // Hardcoded for demo, normally would come from user's name
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          <AvatarImage src={previewUrl || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-xs font-medium">Change</span>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*"
        className="hidden" 
      />
      
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={triggerFileInput}
        size="sm"
      >
        Upload Image
      </Button>
    </div>
  );
};

export default ImageUploader;
