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
import { CountrySelect } from "./CountrySelect";
import { PhoneInput } from "./PhoneInput";

// Move these to a separate constants file if needed
const countryCodes = ["+1", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+90", "+91", "+92", "+93", "+94", "+95", "+98"];

const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

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
    country: "United States",
  });

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