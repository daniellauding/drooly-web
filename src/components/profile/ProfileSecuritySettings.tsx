import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { DeleteAccountDialog } from "./security/DeleteAccountDialog";
import { ReAuthDialog } from "./security/ReAuthDialog";
import { PrivacySection } from "./security/PrivacySection";
import { SecuritySection } from "./security/SecuritySection";
import { FormFooter } from "./FormFooter";

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
      
      if (isPrivate !== undefined) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          isPrivate,
          updatedAt: new Date(),
        });
        console.log("Privacy settings updated");
      }

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
      <PrivacySection 
        isPrivate={isPrivate}
        onPrivacyChange={handlePrivacyChange}
      />

      <SecuritySection
        currentPassword={currentPassword}
        newPassword={newPassword}
        onPasswordChange={handlePasswordChange}
      />

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

      <FormFooter
        onCancel={onClose}
        onSave={handleSave}
        disabled={!hasChanges}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={() => {
          setDeleteDialogOpen(false);
          setReAuthDialogOpen(true);
        }}
      />

      <ReAuthDialog
        open={reAuthDialogOpen}
        onOpenChange={setReAuthDialogOpen}
        password={deletePassword}
        onPasswordChange={setDeletePassword}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}