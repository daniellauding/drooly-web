import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProfileFormFields } from "./ProfileFormFields";

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
          const countryCode = userData.countryCode || "+1";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      console.log("Updating user profile:", formData);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.phone,
        countryCode: formData.countryCode,
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
      <ProfileFormFields formData={formData} setFormData={setFormData} />
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}