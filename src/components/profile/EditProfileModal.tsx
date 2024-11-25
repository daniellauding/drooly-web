import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from "firebase/auth";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfilePrivacySettings } from "./ProfilePrivacySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "./AvatarUpload";

interface EditProfileModalProps {
  userData: {
    name: string;
    username: string;
    birthday: string;
    email: string;
    phone: string;
    bio: string;
    gender: string;
    isPrivate: boolean;
    avatarUrl: string;
  };
  onUpdate: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ userData: initialUserData, onUpdate, open, onOpenChange }: EditProfileModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Load user data when modal opens
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        console.log("Loading user data for modal:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Loaded user data:", data);
          setFormData(prev => ({
            ...prev,
            ...data,
            email: user.email || '',
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again.",
        });
      }
    };

    if (open) {
      loadUserData();
    }
  }, [open, user, toast]);

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;
      
      console.log("Updating user profile:", formData);
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        username: formData.username,
        birthday: formData.birthday,
        phone: formData.phone,
        bio: formData.bio,
        gender: formData.gender,
        isPrivate: formData.isPrivate,
        avatarUrl: formData.avatarUrl,
        updatedAt: new Date(),
      });

      // Update the auth profile using imported updateProfile
      await updateProfile(auth.currentUser!, {
        displayName: formData.name,
        photoURL: formData.avatarUrl,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!user || !user.email) return;
      
      console.log("Updating password");
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
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

  const handleDeleteAccount = async () => {
    try {
      if (!user) return;
      
      console.log("Deleting user account");
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await logout();
      
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatarUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Top Section with Avatar and Key Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <AvatarUpload
              currentAvatar={formData.avatarUrl}
              onAvatarChange={(newAvatar) => setFormData(prev => ({ ...prev, avatarUrl: newAvatar }))}
            />
            <div className="flex-1 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <ProfileBasicInfo formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <ProfilePrivacySettings 
                isPrivate={formData.isPrivate}
                onPrivacyChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                currentPassword={currentPassword}
                newPassword={newPassword}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onPasswordUpdate={handlePasswordUpdate}
                onDeleteAccount={() => setDeleteDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}