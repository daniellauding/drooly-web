import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

interface ProfileData {
  name: string;
  username: string;
  birthday: string;
  phone: string;
  bio: string;
  gender: string;
  isPrivate: boolean;
  avatarUrl: string;
}

export const updateUserProfile = async (userId: string, formData: ProfileData) => {
  console.log("Starting profile update for user:", userId);
  
  try {
    // First update Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: formData.name,
      username: formData.username,
      birthday: formData.birthday,
      phone: formData.phone,
      bio: formData.bio,
      gender: formData.gender,
      isPrivate: formData.isPrivate,
      avatarUrl: formData.avatarUrl,
      updatedAt: new Date(),
    });
    
    console.log("Firestore update successful");

    // Then update Auth profile if user is authenticated
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: formData.avatarUrl,
      });
      console.log("Auth profile update successful");
    }

    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
};