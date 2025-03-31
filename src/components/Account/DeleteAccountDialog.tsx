
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
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

interface DeleteAccountDialogProps {
  onDelete: (reason: string) => Promise<void>;
}

const DeleteAccountDialog = ({ onDelete }: DeleteAccountDialogProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
      await onDelete(deleteReason);
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
              Type <strong>DELETE</strong> to confirm deletion:
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
  );
};

export default DeleteAccountDialog;
