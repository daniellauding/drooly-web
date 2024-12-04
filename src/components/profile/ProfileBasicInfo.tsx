import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AvatarUpload } from "./AvatarUpload";
import { CountrySelect } from "./CountrySelect";
import { PhoneInput } from "./PhoneInput";
import { countries, countryCodes } from "@/components/settings/profileConstants";
import { FormFooter } from "./FormFooter";
import { useTranslation } from "react-i18next";

interface ProfileBasicInfoProps {
  userData: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    birthday: string;
    phone: string;
    countryCode: string;
    bio: string;
    gender: string;
    country: string;
    language?: string;
  };
  onUpdate: () => void;
  onClose: () => void;
}

export function ProfileBasicInfo({ userData, onUpdate, onClose }: ProfileBasicInfoProps) {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: userData.name || "",
    birthday: userData.birthday || "",
    phone: userData.phone || "",
    countryCode: userData.countryCode || "+1",
    bio: userData.bio || "",
    gender: userData.gender || "prefer-not-to-say",
    avatarUrl: userData.avatarUrl || "",
    country: userData.country || "United States",
    language: userData.language || i18n.language || "sv",
  });

  useEffect(() => {
    setFormData({
      name: userData.name || "",
      birthday: userData.birthday || "",
      phone: userData.phone || "",
      countryCode: userData.countryCode || "+1",
      bio: userData.bio || "",
      gender: userData.gender || "prefer-not-to-say",
      avatarUrl: userData.avatarUrl || "",
      country: userData.country || "United States",
      language: userData.language || i18n.language || "sv",
    });
  }, [userData]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    try {
      console.log("Updating user profile with data:", formData);
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date(),
      });
      
      // Update the application language
      i18n.changeLanguage(formData.language);
      
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
        <div className="flex justify-center cursor-pointer">
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
          <Label htmlFor="language">Language</Label>
          <Select 
            value={formData.language}
            onValueChange={value => setFormData(prev => ({ ...prev, language: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sv">Svenska</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
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
          <Label>Country</Label>
          <CountrySelect
            value={formData.country}
            onValueChange={(country) => setFormData(prev => ({ ...prev, country }))}
            countries={countries}
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
          <PhoneInput
            countryCode={formData.countryCode}
            phone={formData.phone}
            onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
            onPhoneChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
            countryCodes={countryCodes}
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

      <FormFooter 
        onCancel={onClose}
        onSave={handleSubmit}
      />
    </form>
  );
}