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
          console.log("[AuthProvider] Auth state changed - User:", firebaseUser.email);
          
          // Verify the token is still valid
          try {
            console.log("[AuthProvider] Refreshing token");
            await firebaseUser.getIdToken(true);
            console.log("[AuthProvider] Token refreshed successfully");
          } catch (tokenError) {
            console.error("[AuthProvider] Token refresh failed:", tokenError);
            // Force logout if token is invalid
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
              console.warn("[AuthProvider] No user data found in Firestore");
              // Create user document if it doesn't exist
              await authService.createUserDocument(firebaseUser);
              console.log("[AuthProvider] Created new user document");
            }
            
            // Check both Firebase Auth and Firestore verification status
            const isVerified = firebaseUser.emailVerified || userData?.manuallyVerified;
            
            setUser({ 
              ...firebaseUser, 
              role: userData?.role || 'user',
              manuallyVerified: userData?.manuallyVerified || false,
              photoURL: userData?.avatarUrl || firebaseUser.photoURL
            });

            if (!isVerified) {
              console.log("[AuthProvider] User not verified, showing toast");
              toast({
                title: "Email verification required",
                description: "Please check your inbox and verify your email to access all features.",
                duration: 10000,
              });
            }
          } catch (error) {
            console.error("[AuthProvider] Error fetching user data:", error);
            // Don't clear user here, just log the error and keep basic Firebase user data
            setUser(firebaseUser);
          }
        } else {
          console.log("[AuthProvider] No user signed in");
          setUser(null);
        }
      } catch (error) {
        console.error("[AuthProvider] Auth state change error:", error);
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

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const user = await authService.loginUser(email, password);
      
      if (!user) {
        throw new Error("Login failed - no user returned");
      }

      const userData = await authService.getUserData(user);
      
      // Check both verification methods
      const isVerified = user.emailVerified || userData?.manuallyVerified;
      
      if (!isVerified) {
        try {
          await sendVerificationEmail();
        } catch (error: any) {
          console.error("Error sending verification email:", error);
          if (error.message.includes("too-many-requests")) {
            toast({
              variant: "destructive",
              title: "Rate limit",
              description: "Too many attempts. Please try again later.",
            });
          }
        }
        await logout();
        toast({
          variant: "destructive",
          title: "Email not verified",
          description: "Please verify your email before logging in.",
        });
        return;
      }

      setUser({ 
        ...user, 
        role: userData?.role,
        manuallyVerified: userData?.manuallyVerified 
      });

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password.";
      
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again in a few minutes.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authService.registerUser(email, password, name);
      
      toast({
        title: "Account created successfully",
        description: "Please check your inbox and verify your email address to continue.",
        duration: 10000,
      });

      await logout();
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Could not create your account. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
      throw error;
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      await authService.verifyUserEmail(code);
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully. Please log in.",
      });
      
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error("Error verifying email:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Could not verify your email. Please try again.",
      });
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        console.log("Sending verification email to:", auth.currentUser.email);
        await authService.sendVerificationEmailToUser(auth.currentUser);
        toast({
          title: "Verification email sent",
          description: "Please check your inbox and verify your email address.",
          duration: 5000,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send verification email. Please try again.",
        });
        throw error;
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
