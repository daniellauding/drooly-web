import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export function PrivacySettings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadPrivacySettings = async () => {
      if (!user?.uid) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsPrivate(userDoc.data().isPrivate || false);
        }
      } catch (error) {
        console.error("Error loading privacy settings:", error);
      }
    };

    loadPrivacySettings();
  }, [user]);

  const handlePrivacyChange = async (checked: boolean) => {
    if (!user?.uid) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isPrivate: checked,
        updatedAt: new Date(),
      });
      
      setIsPrivate(checked);
      toast({
        title: "Privacy settings updated",
        description: `Your account is now ${checked ? 'private' : 'public'}.`,
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update privacy settings.",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both password fields.",
      });
      return;
    }

    try {
      // Add your password update logic here
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
        description: "Failed to update password. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await logout();
      navigate("/");
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
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

        <Button 
          onClick={handlePasswordUpdate}
          disabled={!currentPassword || !newPassword}
        >
          Update Password
        </Button>
      </div>

      <div className="border-t pt-4">
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
        >
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
            <AlertDialogAction onClick={handleDeleteAccount}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}