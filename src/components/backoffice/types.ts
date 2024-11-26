export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: { seconds: number };
  recipes?: any[];
  invites?: UserInvite[];
  emailVerified?: boolean;
  manuallyVerified?: boolean;
  awaitingVerification?: boolean;
  lastLoginAt?: string | null;
}

export interface UserInvite {
  id: string;
  status: 'pending' | 'sent' | 'opened' | 'accepted' | 'rejected';
  email: string;
  role: string;
  createdAt: Date;
  updatedAt?: Date;
  expiresAt: Date;
  marketingContent?: {
    popularRecipes?: boolean;
    topCreators?: boolean;
  };
}