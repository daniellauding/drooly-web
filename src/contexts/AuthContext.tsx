import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, AuthUser } from "@/types/auth";
import * as authService from "@/services/authService";
import { logAppState } from '../utils/debugLogger';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('[Auth Context] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.group('👤 Auth State Change');
      console.log('User:', user ? 'Logged in' : 'Logged out');
      if (user) {
        console.log('User ID:', user.uid);
        console.log('Email:', user.email);
        console.log('Email verified:', user.emailVerified);
        await logAppState(user.uid);
      }
      setUser(user);
      setLoading(false);
      console.groupEnd();
    });

    // Listen for token changes (includes email verification status)
    const unsubscribeToken = onIdTokenChanged(auth, (firebaseUser) => {
      if (firebaseUser && user) {
        setUser(currentUser => currentUser ? {
          ...currentUser,
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