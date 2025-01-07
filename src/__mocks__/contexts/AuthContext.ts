import { AuthContextType } from "@/types/auth";
import { User } from "firebase/auth";
import { jest } from '@jest/globals';

// Create properly typed mock functions
const mockLogin = jest.fn<(email: string, password: string) => Promise<User>>();
const mockRegister = jest.fn<(email: string, password: string, displayName: string) => Promise<User>>();
const mockLogout = jest.fn<() => Promise<void>>();
const mockVerifyEmail = jest.fn<() => Promise<boolean>>();
const mockSendVerificationEmail = jest.fn<() => Promise<boolean>>();

// Set default resolved values
mockLogin.mockResolvedValue({} as User);
mockRegister.mockResolvedValue({} as User);
mockLogout.mockResolvedValue();
mockVerifyEmail.mockResolvedValue(true);
mockSendVerificationEmail.mockResolvedValue(true);

export const mockAuthContext: AuthContextType = {
  user: null,
  loading: false,
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
  verifyEmail: mockVerifyEmail,
  sendVerificationEmail: mockSendVerificationEmail
};

export const useAuth = jest.fn(() => mockAuthContext);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => children;

// Export individual mocks for direct access in tests
export const authMocks = {
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
  verifyEmail: mockVerifyEmail,
  sendVerificationEmail: mockSendVerificationEmail
};