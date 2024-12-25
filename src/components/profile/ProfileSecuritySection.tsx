import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteUserAccount } from "@/services/authService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { debugViews } from "@/utils/debugViews";
import { useViewLogger } from '@/hooks/useViewLogger';
import { ConfirmPasswordDialog } from "@/components/profile/ConfirmPasswordDialog";

export function ProfileSecuritySection() {
  const viewId = useViewLogger('ProfileSecuritySection');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();

  // Log when component mounts
  useEffect(() => {
    debugViews.log('ProfileSecuritySection', 'MOUNTED');
  }, []);

  const handleDeleteClick = () => {
    debugViews.log('ProfileSecuritySection', 'DELETE_BUTTON_CLICKED', {
      viewId,
      timestamp: Date.now()
    });
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    debugViews.log('DeleteConfirmationDialog', open ? 'DIALOG_OPENED' : 'DIALOG_CLOSED', {
      viewId: `${viewId}-delete-confirmation`,
      dialogName: 'Delete Account Confirmation',
      isOpen: open,
      type: 'confirmation',
      timestamp: Date.now()
    });
    setShowDeleteDialog(open);
  };

  const handleDeleteConfirm = () => {
    debugViews.log('ProfileSecuritySection', 'DELETE_CONFIRMED', {
      viewId,
      timestamp: Date.now()
    });
    setShowDeleteDialog(false);
    setShowPasswordDialog(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      await deleteUserAccount(password);
    } catch (error: any) {
      debugViews.log('ProfileSecuritySection', 'DELETE_ERROR', {
        viewId,
        error: error.message,
        timestamp: Date.now()
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handlePasswordDialogChange = (open: boolean) => {
    debugViews.log('ConfirmPasswordDialog', open ? 'DIALOG_OPENED' : 'DIALOG_CLOSED', {
      viewId: `${viewId}-password-confirmation`,
      dialogName: 'Confirm Password',
      isOpen: open,
      timestamp: Date.now()
    });
    setShowPasswordDialog(open);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data
        </p>
        <Button 
          variant="destructive" 
          onClick={handleDeleteClick}
          className="mt-4"
        >
          Delete Account
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConfirmPasswordDialog
        open={showPasswordDialog}
        onOpenChange={handlePasswordDialogChange}
        onConfirm={handlePasswordConfirm}
      />
    </div>
  );
}