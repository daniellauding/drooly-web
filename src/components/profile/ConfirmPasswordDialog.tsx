import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ConfirmPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<void>;
}

export function ConfirmPasswordDialog({ open, onOpenChange, onConfirm }: ConfirmPasswordDialogProps) {
  const viewId = useViewLogger('ConfirmPasswordDialog');
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    debugViews.log('ConfirmPasswordDialog', 'PASSWORD_CONFIRM_CLICKED', {
      viewId,
      timestamp: Date.now()
    });
    await onConfirm(password);
    setPassword("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    debugViews.log('ConfirmPasswordDialog', isOpen ? 'DIALOG_OPENED' : 'DIALOG_CLOSED', {
      viewId,
      dialogName: 'Confirm Password',
      isOpen,
      timestamp: Date.now()
    });
    onOpenChange(isOpen);
    if (!isOpen) setPassword("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm your password</AlertDialogTitle>
          <AlertDialogDescription>
            For security reasons, please enter your password to continue with account deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!password}>
            Confirm Deletion
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 