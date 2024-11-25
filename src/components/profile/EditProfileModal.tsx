import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfilePrivacySettings } from "./ProfilePrivacySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function EditProfileModal({ userData, onUpdate, open, onOpenChange }: EditProfileModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();

  console.log("EditProfileModal rendered with open:", open);

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
            <div className="relative">
              <img
                src={formData.avatarUrl || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                {formData.avatarUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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