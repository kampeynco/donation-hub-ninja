
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { IconInfoCircle } from "@tabler/icons-react";

interface NotInterestedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasons = [
  { id: "not-needed", label: "I don't need this feature" },
  { id: "too-expensive", label: "It seems too expensive" },
  { id: "confusing", label: "The feature looks confusing" },
  { id: "future", label: "I might need it in the future" },
  { id: "other", label: "Other reason" },
];

const NotInterestedModal = ({ open, onOpenChange }: NotInterestedModalProps) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: { reason: string }) => {
    // Save preference to localStorage
    localStorage.setItem("hidePersonasSidebar", "true");
    
    // Close modal
    onOpenChange(false);
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Why aren't you interested?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our product. You can always enable this feature later in your settings.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {reasons.map((reason) => (
                        <FormItem
                          key={reason.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={reason.id} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {reason.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex gap-2">
              <IconInfoCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                You can enable this feature anytime from your account settings.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NotInterestedModal;
