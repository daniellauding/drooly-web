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
    console.log("[AuthProvider] Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log("[AuthProvider] Auth state changed - User:", firebaseUser.uid);
          
          // Verify the token is still valid
          try {
            console.log("[AuthProvider] Refreshing token");
            await firebaseUser.getIdToken(true);
            console.log("[AuthProvider] Token refreshed successfully");
          } catch (tokenError) {
            console.error("[AuthProvider] Token refresh failed:", tokenError);
            await auth.signOut();
            setUser(null);
            setLoading(false);
            return;
          }
          
          try {
            console.log("[AuthProvider] Fetching user data from Firestore");
            const userData = await authService.getUserData(firebaseUser);
            console.log("[AuthProvider] User data from Firestore:", userData);
            
            if (!userData) {
              console.log("[AuthProvider] No user data found, creating document");
              await authService.createUserDocument(firebaseUser);
              const newUserData = await authService.getUserData(firebaseUser);
              console.log("[AuthProvider] New user document created:", newUserData);
              
              if (!newUserData) {
                throw new Error("Failed to create user document");
              }
              
              setUser({ 
                ...firebaseUser, 
                role: newUserData.role || 'user',
                manuallyVerified: newUserData.manuallyVerified || false,
                photoURL: newUserData.avatarUrl || firebaseUser.photoURL
              });
            } else {
              setUser({ 
                ...firebaseUser, 
                role: userData.role || 'user',
                manuallyVerified: userData.manuallyVerified || false,
                photoURL: userData.avatarUrl || firebaseUser.photoURL
              });
            }
            
            // Check verification status
            const isVerified = firebaseUser.emailVerified || userData?.manuallyVerified;
            if (!isVerified) {
              console.log("[AuthProvider] User not verified, showing toast");
              toast({
                title: "Email verification required",
                description: "Please check your inbox and verify your email to access all features.",
                duration: 10000,
              });
            }
          } catch (error) {
            console.error("[AuthProvider] Error handling user data:", error);
            toast({
              variant: "destructive",
              title: "Error loading user data",
              description: "Please try refreshing the page. If the problem persists, contact support.",
            });
            setUser(null);
          }
        } else {
          console.log("[AuthProvider] No user signed in");
          setUser(null);
        }
      } catch (error) {
        console.error("[AuthProvider] Auth state change error:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please try signing in again.",
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("[AuthProvider] Cleaning up auth state listener");
      unsubscribe();
    };
  }, [toast]);

  const value = {
    user,
    loading,
    login: authService.loginUser,
    register: authService.registerUser,
    logout: authService.logoutUser,
    verifyEmail: authService.verifyUserEmail,
    sendVerificationEmail: authService.sendVerificationEmailToUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
