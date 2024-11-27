import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SingleSelect } from "@/components/SingleSelect";
import { PhoneInput } from "@/components/profile/PhoneInput";
import { CountrySelect } from "@/components/profile/CountrySelect";

// Move these to a separate constants file if needed
const countryCodes = ["+1", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+90", "+91", "+92", "+93", "+94", "+95", "+98"];

const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    phone: "",
    countryCode: "+1",
    bio: "",
    gender: "prefer-not-to-say",
    avatarUrl: "",
    country: "United States",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        console.log("Loading user data for:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Loaded user data:", userData);
          
          // Extract phone number and country code
          const phoneNumber = userData.phone || "";
          const countryCode = countryCodes.find(code => phoneNumber.startsWith(code)) || "+1";
          const phoneWithoutCode = phoneNumber.replace(countryCode, "");

          setFormData({
            name: userData.name || "",
            birthday: userData.birthday || "",
            phone: phoneWithoutCode || "",
            countryCode: countryCode,
            bio: userData.bio || "",
            gender: userData.gender || "prefer-not-to-say",
            avatarUrl: userData.avatarUrl || "",
            country: userData.country || "United States",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, toast]);

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
      console.log("Updating user profile:", formData);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.countryCode + formData.phone,
        bio: formData.bio,
        gender: formData.gender,
        avatarUrl: formData.avatarUrl,
        country: formData.country,
        updatedAt: new Date(),
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      console.log("Profile update successful");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Avatar section */}
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
          <Label>Country</Label>
          <CountrySelect
            value={formData.country}
            onValueChange={(country) => setFormData(prev => ({ ...prev, country }))}
            countries={countries}
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

      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}