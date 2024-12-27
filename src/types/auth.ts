import { User } from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  role?: string;
  manuallyVerified?: boolean;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  sendVerificationEmail: (user: any) => Promise<boolean>;
}