import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, onIdTokenChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, AuthUser } from "@/types/auth";
import * as authService from "@/services/authService";
import { doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { setDoc } from "firebase/firestore";
import { setUserProperties, trackUserSession } from '../services/analyticsService';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const mergeUserData = async (firebaseUser: any) => {
    if (!firebaseUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      return {
        ...firebaseUser,
        ...userData,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return firebaseUser;
    }
  };

  useEffect(() => {
    console.log('[Auth Context] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.group('👤 Auth State Change');
      if (firebaseUser) {
        console.log('User:', 'Logged in');
        console.log('Email verified:', firebaseUser.emailVerified);
        
        const mergedUser = await mergeUserData(firebaseUser);
        setUser(mergedUser);

        // Set user properties in GA4
        setUserProperties({
          userId: firebaseUser.uid,
          userRole: 'registered',
          isNewUser: firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime
        });

        // Track user session
        trackUserSession(firebaseUser.uid, {
          isNewUser: firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime,
          userRole: 'registered',
          lastLoginAt: firebaseUser.metadata.lastSignInTime
        });
      } else {
        setUser(null);

        // Track anonymous session
        trackUserSession(null, {
          isNewUser: false,
          userRole: 'anonymous'
        });
      }
      setLoading(false);
      console.groupEnd();
    });

    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.getIdToken(true);
        const mergedUser = await mergeUserData(firebaseUser);
        setUser(currentUser => ({
          ...currentUser,
          ...mergedUser,
          emailVerified: firebaseUser.emailVerified
        }));
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login: authService.loginUser,
    register: authService.registerUser,
    logout,
    verifyEmail: authService.verifyUserEmail,
    sendVerificationEmail: authService.sendVerificationEmailToUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}