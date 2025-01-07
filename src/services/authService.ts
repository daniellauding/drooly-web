import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, actionCodeSettings } from "@/lib/firebase";
import { logger } from "@/utils/logger";
import { trackError } from "./analyticsService";
import { getFunctions, httpsCallable } from "firebase/functions";

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    logger.error("Login failed:", error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      role: "user",
      createdAt: new Date().toISOString(),
      emailVerified: false
    });

    // Update profile
    await updateProfile(user, {
      displayName
    });

    // Send verification email
    if (user) {
      await sendEmailVerification(user, actionCodeSettings);
    }

    return user;
  } catch (error: any) {
    logger.error("Registration failed:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    logger.error("Logout failed:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    logger.error("Password reset failed:", error);
    throw error;
  }
};

export const verifyUserEmail = async () => {
  try {
    logger.debug("Verifying email");
    // Implementation for email verification
    return true;
  } catch (error: any) {
    logger.error("Email verification failed:", error);
    throw error;
  }
};

export const sendVerificationEmailToUser = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return true;
    }
    return false;
  } catch (error: any) {
    logger.error("Failed to send verification email:", error);
    trackError('verification_email_error', error.message);
    throw error;
  }
};

export const deleteUserAccount = async (password: string) => {
  try {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }

    // Call the Cloud Function to delete user data with password
    const functions = getFunctions();
    const deleteUserAccountFn = httpsCallable(functions, 'deleteUserAccount');
    await deleteUserAccountFn({ password }); // Pass password to Cloud Function

    logger.info("Account deletion completed successfully");
    return true;
  } catch (error: any) {
    logger.error("Error deleting account:", error);
    throw error;
  }
};
