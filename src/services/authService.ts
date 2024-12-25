import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  User,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logger } from "@/utils/logger";
import { logAppState } from '../utils/debugLogger';
import { debugViews } from "@/utils/debugViews";

const EMAIL_COOLDOWN = 60000; // 1 minute cooldown
let lastEmailSent = 0;

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await logAppState(userCredential.user.uid);
    }
    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
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

export const deleteUserAccount = async () => {
  debugViews.log('AuthService', 'DELETE_ACCOUNT_STARTED');
  
  try {
    const user = auth.currentUser;
    debugViews.log('AuthService', 'CURRENT_USER', { uid: user?.uid });
    
    if (!user) {
      debugViews.log('AuthService', 'NO_USER_FOUND');
      throw new Error("No authenticated user found");
    }

    debugViews.log('AuthService', 'DELETING_FIRESTORE_DATA');
    await deleteDoc(doc(db, "users", user.uid));
    debugViews.log('AuthService', 'FIRESTORE_DATA_DELETED');

    debugViews.log('AuthService', 'DELETING_AUTH_USER');
    await deleteUser(user);
    debugViews.log('AuthService', 'AUTH_USER_DELETED');

    debugViews.log('AuthService', 'STARTING_CLEANUP');
    localStorage.clear();
    sessionStorage.clear();
    debugViews.log('AuthService', 'CLEANUP_COMPLETE');

    debugViews.log('AuthService', 'REDIRECTING');
    window.location.href = '/';

  } catch (error: any) {
    debugViews.log('AuthService', 'DELETE_ERROR', error);
    throw new Error("Failed to delete account");
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

export const forceLogout = async () => {
  try {
    console.log("Force logging out...");
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
    return true;
  } catch (error) {
    console.error("Error during force logout:", error);
    throw error;
  }
};
