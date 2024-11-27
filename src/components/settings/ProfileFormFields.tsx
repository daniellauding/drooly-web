import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountrySelect } from "../profile/CountrySelect";
import { PhoneInput } from "../profile/PhoneInput";
import { AvatarUpload } from "../profile/AvatarUpload";
import { countries, countryCodes } from "./profileConstants";

interface ProfileFormFieldsProps {
  formData: {
    name: string;
    birthday: string;
    phone: string;
    countryCode: string;
    bio: string;
    gender: string;
    avatarUrl: string;
    country: string;
  };
  setFormData: (data: any) => void;
}

export function ProfileFormFields({ formData, setFormData }: ProfileFormFieldsProps) {
  return (
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
  );
}