import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings2, Trash2, LogOut, Camera, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
}

export function EditProfileModal({ userData, onUpdate }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();

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
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
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
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={e => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
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

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={value => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                  <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Private Account</Label>
                <p className="text-sm text-muted-foreground">
                  Only approved followers can see your content when enabled
                </p>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, isPrivate: checked }))}
              />
            </div>
          </div>

          {/* Password Update */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Update Password</h4>
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

          {/* Actions */}
          <div className="flex justify-between border-t pt-4">
            <div className="space-x-2">
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <Button variant="outline" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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