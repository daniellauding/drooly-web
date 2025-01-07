import React from 'react';

export const mockAuthContext = {
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  verifyEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
};

export const AuthContext = React.createContext(mockAuthContext);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
}; 