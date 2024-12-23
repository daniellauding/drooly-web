import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, AuthUser } from "@/types/auth";
import * as authService from "@/services/authService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          ...firebaseUser,
          role: 'user',
        };
        
        try {
          const userData = await authService.getUserData(firebaseUser);
          if (userData) {
            authUser.role = userData.role;
            authUser.manuallyVerified = userData.manuallyVerified;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
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
      unsubscribeAuth();
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