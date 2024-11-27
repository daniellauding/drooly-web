import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";

interface ProfileSecuritySettingsProps {
  userId: string;
  onClose: () => void;
}

export function ProfileSecuritySettings({ userId, onClose }: ProfileSecuritySettingsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reAuthDialogOpen, setReAuthDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handlePrivacyChange = (checked: boolean) => {
    setIsPrivate(checked);
    setHasChanges(true);
  };

  const handlePasswordChange = (field: 'current' | 'new', value: string) => {
    if (field === 'current') setCurrentPassword(value);
    else setNewPassword(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      console.log("Saving security settings...");
      
      // Update privacy setting
      if (isPrivate !== undefined) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          isPrivate,
          updatedAt: new Date(),
        });
        console.log("Privacy settings updated");
      }

      // Update password if both fields are filled
      if (currentPassword && newPassword) {
        console.log("Updating password...");
        if (!auth.currentUser?.email) {
          throw new Error("No authenticated user found");
        }

        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        console.log("Password updated successfully");
      }

      toast({
        title: "Settings saved",
        description: "Your security settings have been updated successfully.",
      });

      setHasChanges(false);
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (error: any) {
      console.error("Error saving security settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser?.email) return;

    try {
      console.log("Authenticating for account deletion...");
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        deletePassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Delete user document
      await updateDoc(doc(db, "users", userId), {
        deletedAt: new Date(),
        isDeleted: true
      });

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      setReAuthDialogOpen(false);
      onClose();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Private Account</Label>
            <p className="text-sm text-muted-foreground">
              Only approved followers can see your content when enabled
            </p>
          </div>
          <Switch
            checked={isPrivate}
            onCheckedChange={handlePrivacyChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security Settings</h3>
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={e => handlePasswordChange('current', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={e => handlePasswordChange('new', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
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
            <AlertDialogAction 
              onClick={() => {
                setDeleteDialogOpen(false);
                setReAuthDialogOpen(true);
              }}
              className="bg-destructive text-destructive-foreground"
            >
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
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Confirm Deletion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}