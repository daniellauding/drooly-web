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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Auth state changed - User:", user.email);
        try {
          const userData = await authService.getUserData(user);
          
          setUser({ 
            ...user, 
            role: userData?.role,
            manuallyVerified: userData?.manuallyVerified,
            photoURL: userData?.avatarUrl || user.photoURL
          });

          if (!user.emailVerified && !userData?.manuallyVerified) {
            toast({
              title: "Email verification required",
              description: "Please check your inbox and verify your email to access all features.",
              duration: 10000,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.loginUser(email, password);
      const userData = await authService.getUserData(user);

      // Allow login if either emailVerified or manuallyVerified is true
      if (!user.emailVerified && !userData?.manuallyVerified) {
        toast({
          variant: "destructive",
          title: "Email not verified",
          description: "Please verify your email before logging in.",
        });
        await sendVerificationEmail();
        await logout();
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
      
      if (error.code === "auth/user-not-found") {
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