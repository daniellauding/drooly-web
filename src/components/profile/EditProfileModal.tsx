import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfileSecuritySettings } from "./ProfileSecuritySettings";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [fullUserData, setFullUserData] = useState({
    ...userData,
    birthday: "",
    phone: "",
    countryCode: "+1",
    bio: "",
    gender: "prefer-not-to-say",
    country: "United States",
  });

  useEffect(() => {
    const fetchFullUserData = async () => {
      try {
        console.log("Fetching full user data for:", userData.id);
        const userDoc = await getDoc(doc(db, "users", userData.id));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Fetched user data:", data);
          
          setFullUserData(prev => ({
            ...prev,
            ...data,
            // Ensure we keep the basic data if not present in Firestore
            id: userData.id,
            name: data.name || userData.name,
            email: userData.email,
            avatarUrl: data.avatarUrl || userData.avatarUrl,
            // Set defaults for optional fields if not present
            birthday: data.birthday || "",
            phone: data.phone || "",
            countryCode: data.countryCode || "+1",
            bio: data.bio || "",
            gender: data.gender || "prefer-not-to-say",
            country: data.country || "United States",
          }));
        }
      } catch (error) {
        console.error("Error fetching full user data:", error);
      }
    };

    if (open && userData.id) {
      fetchFullUserData();
    }
  }, [open, userData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl outline-none">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <ProfileBasicInfo 
              userData={fullUserData}
              onUpdate={onUpdate}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="privacy" className="mt-4">
            <ProfileSecuritySettings 
              userId={userData.id}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
