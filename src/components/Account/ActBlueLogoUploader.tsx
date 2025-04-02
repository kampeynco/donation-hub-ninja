
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IconUpload } from "@tabler/icons-react";

interface ActBlueLogoUploaderProps {
  onUploadSuccess: (url: string) => void;
}

const ActBlueLogoUploader: React.FC<ActBlueLogoUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create FormData for the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the edge function to upload the file
      const { data, error } = await supabase.functions.invoke('upload-actblue-logo', {
        body: formData,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Upload successful",
        description: "ActBlue logo has been uploaded",
      });
      
      if (data.publicUrl) {
        onUploadSuccess(data.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading ActBlue logo:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <input
        type="file"
        id="actblue-logo"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => document.getElementById('actblue-logo')?.click()}
      >
        <IconUpload size={16} className="mr-2" />
        {isUploading ? "Uploading..." : "Upload ActBlue Logo"}
      </Button>
    </div>
  );
};

export default ActBlueLogoUploader;
