import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { AuthContextType } from "@/types/auth";
import * as authService from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login: authService.loginUser,
    register: authService.registerUser,
    logout: authService.logoutUser,
    verifyEmail: authService.verifyUserEmail,
    sendVerificationEmail: authService.sendVerificationEmailToUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};