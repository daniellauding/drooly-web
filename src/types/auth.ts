import { User } from "firebase/auth";

export interface AuthUser extends User {
  role?: string;
  manuallyVerified?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}