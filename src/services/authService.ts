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
import { logAppState } from '../utils/debugLogger';

const EMAIL_COOLDOWN = 60000; // 1 minute cooldown
let lastEmailSent = 0;

export const loginUser = async (email: string, password: string) => {
  console.group('🔐 Auth: Login Attempt');
  console.log('Email:', email);
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful');
    console.log('User ID:', result.user.uid);
    console.log('Email verified:', result.user.emailVerified);
    
    // Log app state after successful login
    await logAppState(result.user.uid);
    
    return result;
  } catch (error: any) {
    console.error('❌ Login failed:', error.code, error.message);
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const getUserData = async (user: User) => {
  console.log("[AuthService] Fetching user data for:", user.uid);
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.warn("[AuthService] No user document found for:", user.uid);
      return null;
    }
    
    const userData = userDoc.data();
    console.log("[AuthService] Retrieved user data:", userData);
    return userData;
  } catch (error) {
    console.error("[AuthService] Error fetching user data:", error);
    throw error;
  }
};

export const createUserDocument = async (user: User) => {
  console.log("[AuthService] Creating user document for:", user.uid);
  try {
    const userData = {
      email: user.email,
      name: user.displayName || "",
      role: "user",
      createdAt: new Date(),
      emailVerified: user.emailVerified,
      manuallyVerified: false,
      avatarUrl: user.photoURL || ""
    };
    
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);
    console.log("[AuthService] User document created successfully");
    return userData;
  } catch (error) {
    console.error("[AuthService] Error creating user document:", error);
    throw error;
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
  try {
    // Make sure we have a valid Firebase user
    if (!auth.currentUser) {
      throw new Error("No authenticated user found");
    }

    // Check cooldown to prevent spam
    if (Date.now() - lastEmailSent < EMAIL_COOLDOWN) {
      const waitTime = Math.ceil((EMAIL_COOLDOWN - (Date.now() - lastEmailSent)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting another email`);
    }
    
    await sendEmailVerification(auth.currentUser, {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    });
    
    lastEmailSent = Date.now();
    return true;
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
