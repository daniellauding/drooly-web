import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase User to AuthUser
        const authUser: AuthUser = {
          ...firebaseUser,
          role: 'user', // default role
        };
        
        // Get additional user data from Firestore
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

    return () => unsubscribe();
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