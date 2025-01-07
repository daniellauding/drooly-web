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
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  logout: () => Promise<void>;
  verifyEmail: () => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
}