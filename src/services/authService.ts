import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  User,
  deleteUser
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logger } from "@/utils/logger";

const EMAIL_COOLDOWN = 60000; // 1 minute cooldown
let lastEmailSent = 0;

export const loginUser = async (email: string, password: string) => {
  logger.info("Attempting login for:", email);
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const getUserData = async (user: User) => {
  logger.info("Fetching user data for:", user.uid);
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      logger.warn("No user document found for:", user.uid);
      return null;
    }
    const userData = userDoc.data();
    logger.debug("Retrieved user data:", userData);
    return userData;
  } catch (error) {
    logger.error("Error fetching user data:", error);
    return null;
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  logger.info("Registering new user:", email);
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
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
  logger.info("Logging out user");
  await signOut(auth);
  // Clear any stored session data
  localStorage.clear();
  sessionStorage.clear();
};

export const deleteUserAccount = async (userId: string) => {
  logger.info("Starting account deletion process for:", userId);
  try {
    // Delete user document and related data
    await deleteDoc(doc(db, "users", userId));
    
    // Force logout and clear all sessions
    await logoutUser();
    
    // Delete the user from Firebase Auth
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
    
    logger.info("Successfully deleted user account:", userId);
  } catch (error) {
    logger.error("Error deleting user account:", error);
    throw error;
  }
};

export const verifyUserEmail = async (code: string) => {
  logger.info("Verifying email with code");
  await applyActionCode(auth, code);
};

export const sendVerificationEmailToUser = async (user: User) => {
  if (!user.emailVerified) {
    logger.info("Attempting to send verification email to:", user.email);
    
    if (Date.now() - lastEmailSent < EMAIL_COOLDOWN) {
      const waitTime = Math.ceil((EMAIL_COOLDOWN - (Date.now() - lastEmailSent)) / 1000);
      logger.warn("Email cooldown in effect:", { waitTime });
      throw new Error(`Please wait ${waitTime} seconds before requesting another verification email.`);
    }
    
    await sendEmailVerification(user, {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    });
    lastEmailSent = Date.now();
    logger.info("Verification email sent successfully");
  }
};
