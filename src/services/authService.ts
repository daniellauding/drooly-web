import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  User,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logger } from "@/utils/logger";
import { logAppState } from '../utils/debugLogger';
import { debugViews } from "@/utils/debugViews";
import { useToast } from "@/hooks/use-toast";

const EMAIL_COOLDOWN = 60000; // 1 minute cooldown
let lastEmailSent = 0;

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful for user:', userCredential.user.uid);
    if (userCredential.user) {
      await logAppState(userCredential.user.uid);
    }
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error details:', {
      code: error.code,
      message: error.message,
      email
    });
    
    // Return user-friendly error messages
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled. Please contact support.');
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      default:
        throw new Error('Login failed. Please check your credentials and try again.');
    }
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
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPrivate: false,
    });

    // Send verification email
    await sendEmailVerification(user, {
      url: window.location.origin + '/login',
    });

    return user;
  } catch (error) {
    throw error; // Let the component handle the error
  }
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

export const signUp = async (email: string, password: string) => {
  console.log('Starting signup process for:', email);
  
  try {
    // Validate password
    if (password.length < 6) {
      console.error('Password too short');
      throw new Error('Password must be at least 6 characters long');
    }

    // Step 1: Create auth user
    console.log('Creating auth user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Auth user created successfully:', user.uid);

    // Step 2: Prepare user data
    const userData = {
      email: email,
      createdAt: new Date().toISOString(),
      role: 'user',
      isVerified: false,
      displayName: '',
      photoURL: '',
      uid: user.uid
    };

    console.log('Creating user document with data:', userData);

    // Step 3: Create user document
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userData);
    console.log('User document created successfully');

    // Step 4: Send verification email
    await sendEmailVerification(user);
    console.log('Verification email sent');

    return userCredential;
  } catch (error: any) {
    console.error('Signup error details:', {
      code: error.code,
      message: error.message,
      email,
      timestamp: new Date().toISOString()
    });

    // Throw specific error messages for the UI
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Registration is currently disabled.');
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    });
    return true;
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later.');
      default:
        throw new Error('Failed to send reset email. Please try again.');
    }
  }
};
