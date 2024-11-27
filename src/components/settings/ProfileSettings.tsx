import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    birthday: "",
    phone: "",
    countryCode: "+1",
    bio: "",
    gender: "prefer-not-to-say",
    avatarUrl: user?.photoURL || "",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.countryCode + formData.phone,
        bio: formData.bio,
        gender: formData.gender,
        avatarUrl: formData.avatarUrl,
        updatedAt: new Date(),
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative w-32 mx-auto">
          <img
            src={formData.avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
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
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
          <Label htmlFor="phone">Phone</Label>
          <div className="flex gap-2">
            <Select 
              value={formData.countryCode}
              onValueChange={value => setFormData(prev => ({ ...prev, countryCode: value }))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+81">+81</SelectItem>
                <SelectItem value="+86">+86</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="flex-1"
            />
          </div>
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
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={formData.gender}
            onValueChange={value => setFormData(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}