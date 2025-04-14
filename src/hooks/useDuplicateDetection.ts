
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { scanForDuplicates } from "@/services/contacts/duplicates";

export function useDuplicateDetection() {
  const [isScanning, setIsScanning] = useState(false);

  // Mutation for scanning duplicates
  const { mutate: scanDuplicates, isPending } = useMutation({
    mutationFn: scanForDuplicates,
    onSuccess: (duplicatesFound) => {
      setIsScanning(false);
      
      if (duplicatesFound > 0) {
        toast({
          title: "Duplicate scan complete",
          description: `Found ${duplicatesFound} potential duplicate${duplicatesFound === 1 ? '' : 's'}`,
        });
      } else {
        toast({
          title: "Duplicate scan complete",
          description: "No new duplicates found",
        });
      }
    },
    onError: (error) => {
      setIsScanning(false);
      toast({
        title: "Failed to scan for duplicates",
        description: "An error occurred while scanning for duplicates",
        variant: "destructive",
      });
      console.error("Duplicate scan error:", error);
    }
  });

  // Function to start scanning
  const startScan = () => {
    setIsScanning(true);
    scanDuplicates();
  };

  return {
    startScan,
    isScanning: isScanning || isPending
  };
}
