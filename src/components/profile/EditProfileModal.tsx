import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfilePrivacySettings } from "./ProfilePrivacySettings";
import { ProfileSecuritySection } from "./ProfileSecuritySection";
import { updateUserProfile } from "./ProfileUpdateService";
import { AvatarUpload } from "./AvatarUpload";
import { useNavigate } from "react-router-dom";

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
  isAdmin?: boolean;
}

export function EditProfileModal({ 
  userData: initialUserData, 
  onUpdate, 
  open, 
  onOpenChange,
  isAdmin 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialUserData);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    if (!user) return;
    
    try {
      console.log("Attempting to update profile with data:", formData);
      await updateUserProfile(user.uid, formData);
      
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <AvatarUpload
              currentAvatar={formData.avatarUrl}
              onAvatarChange={(newAvatar) => setFormData(prev => ({ ...prev, avatarUrl: newAvatar }))}
            />
            <ProfileBasicInfo formData={formData} setFormData={setFormData} />
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
              />
              <ProfileSecuritySection userId={user?.uid} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/backoffice')}
                >
                  Access Backoffice
                </Button>
              )}
            </div>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}