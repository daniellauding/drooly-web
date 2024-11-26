import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProfileBasicInfo } from "./ProfileBasicInfo";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  onUpdate: () => void;
  isAdmin?: boolean;
}

export function EditProfileModal({
  open,
  onOpenChange,
  userData,
  onUpdate,
  isAdmin = false,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: userData.name || "",
    birthday: "",
    phone: "",
    bio: "",
    gender: "prefer-not-to-say",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, formData);
      
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userData.email}
                disabled
                className="bg-muted"
              />
            </div>
            <ProfileBasicInfo formData={formData} setFormData={setFormData} />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}