
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Uploads a file to the specified Supabase storage bucket
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param file The file to upload
 * @returns The public URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      title: "Upload failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Gets the public URL for a file in storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @returns The public URL of the file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
