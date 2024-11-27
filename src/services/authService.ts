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

// Add rate limiting for verification emails
const EMAIL_COOLDOWN = 60000; // 1 minute cooldown
let lastEmailSent = 0;

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
    const userData = userDoc.data();
    console.log("Retrieved user data:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  console.log("Registering new user:", email);
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  // Check cooldown before sending verification email
  if (Date.now() - lastEmailSent > EMAIL_COOLDOWN) {
    await sendEmailVerification(user, {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    });
    lastEmailSent = Date.now();
  }
  
  await setDoc(doc(db, "users", user.uid), {
    email,
    name,
    role: "user",
    createdAt: new Date(),
    emailVerified: false,
    manuallyVerified: false
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
    console.log("Attempting to send verification email to:", user.email);
    
    // Check if enough time has passed since last email
    if (Date.now() - lastEmailSent < EMAIL_COOLDOWN) {
      const waitTime = Math.ceil((EMAIL_COOLDOWN - (Date.now() - lastEmailSent)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting another verification email.`);
    }
    
    await sendEmailVerification(user, {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    });
    lastEmailSent = Date.now();
    console.log("Verification email sent successfully");
  }
};