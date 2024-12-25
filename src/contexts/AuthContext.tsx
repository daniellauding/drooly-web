import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, AuthUser } from "@/types/auth";
import * as authService from "@/services/authService";
import { logAppState } from '../utils/debugLogger';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const mergeUserData = async (firebaseUser: any) => {
    if (!firebaseUser) return null;
    
    try {
      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      // Merge Firebase Auth user with Firestore data
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
      console.log('User:', firebaseUser ? 'Logged in' : 'Logged out');
      
      if (firebaseUser) {
        console.log('User ID:', firebaseUser.uid);
        console.log('Email:', firebaseUser.email);
        console.log('Email verified:', firebaseUser.emailVerified);
        
        // Merge user data and set the state
        const mergedUser = await mergeUserData(firebaseUser);
        setUser(mergedUser);
        await logAppState(firebaseUser.uid);
      } else {
        setUser(null);
      }
      
      setLoading(false);
      console.groupEnd();
    });

    // Listen for token changes (includes email verification status)
    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser && user) {
        const mergedUser = await mergeUserData(firebaseUser);
        setUser(currentUser => currentUser ? {
          ...currentUser,
          ...mergedUser,
          emailVerified: firebaseUser.emailVerified
        } : null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

  const sendVerificationEmail = async () => {
    if (!user) {
      throw new Error("No user logged in");
    }
    await authService.sendVerificationEmailToUser(user);
  };

  const value = {
    user,
    loading,
    login: authService.loginUser,
    register: authService.registerUser,
    logout: authService.logoutUser,
    verifyEmail: authService.verifyUserEmail,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}