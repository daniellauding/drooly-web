import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

interface ProfileSecuritySectionProps {
  userId?: string;
}

export function ProfileSecuritySection({ userId }: ProfileSecuritySectionProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reAuthDialogOpen, setReAuthDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const { toast } = useToast();

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    
    try {
      console.log("Updating password");
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please check your current password and try again.",
      });
    }
  };

  const handleReAuthenticate = async () => {
    if (!auth.currentUser?.email) return;

    try {
      console.log("Re-authenticating user");
      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await handleDeleteAccount();
      setReAuthDialogOpen(false);
    } catch (error) {
      console.error("Error re-authenticating:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid password. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !userId) return;
    
    try {
      console.log("Deleting user account");
      await deleteDoc(doc(db, "users", userId));
      await deleteUser(auth.currentUser);
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting account:", error);
      
      if (error.code === "auth/requires-recent-login") {
        setReAuthDialogOpen(true);
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security Settings</h3>
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <Button onClick={handlePasswordUpdate} disabled={!currentPassword || !newPassword}>
          Update Password
        </Button>
      </div>

      <div className="border-t pt-4">
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={reAuthDialogOpen} onOpenChange={setReAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your password</DialogTitle>
            <DialogDescription>
              For security reasons, please enter your password to continue with account deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setReAuthDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReAuthenticate}>
              Confirm Deletion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}