import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export const loginUser = async (email: string, password: string) => {
  console.log("Attempting login for:", email);
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const getUserData = async (user: User) => {
  console.log("Fetching user data for:", user.uid);
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.log("No user document found for:", user.uid);
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  console.log("Registering new user:", email);
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  await sendEmailVerification(user);
  
  await setDoc(doc(db, "users", user.uid), {
    email,
    name,
    role: "user",
    createdAt: new Date(),
  });
  
  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const verifyUserEmail = async (code: string) => {
  await applyActionCode(auth, code);
};

export const sendVerificationEmailToUser = async (user: User) => {
  if (!user.emailVerified) {
    console.log("Sending verification email to:", user.email);
    await sendEmailVerification(user);
  }
};