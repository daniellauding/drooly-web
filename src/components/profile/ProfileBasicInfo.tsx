import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AvatarUpload } from "./AvatarUpload";

// Country codes list
const countryCodes = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+7", country: "Russia" },
  { code: "+82", country: "South Korea" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+48", country: "Poland" },
  // Add more country codes as needed
].sort((a, b) => a.country.localeCompare(b.country));

interface ProfileBasicInfoProps {
  userData: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  onUpdate: () => void;
  onClose: () => void;
}

export function ProfileBasicInfo({ userData, onUpdate, onClose }: ProfileBasicInfoProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: userData.name || "",
    birthday: "",
    phone: "",
    countryCode: "+1",
    bio: "",
    gender: "prefer-not-to-say",
    avatarUrl: userData.avatarUrl || "",
  });

  const handleAvatarClick = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date(),
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      onUpdate();
      onClose();
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
        <div className="flex justify-center cursor-pointer" onClick={handleAvatarClick}>
          <AvatarUpload
            currentAvatar={formData.avatarUrl}
            onAvatarChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userData.email}
            disabled
            className="bg-muted"
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
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countryCodes.map(({ code, country }) => (
                  <SelectItem key={code} value={code}>
                    {code} {country}
                  </SelectItem>
                ))}
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

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}