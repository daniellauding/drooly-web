import { jest } from '@jest/globals';
import { User } from 'firebase/auth';

export const loginUser = jest.fn<(email: string, password: string) => Promise<User>>();
export const registerUser = jest.fn();
export const logoutUser = jest.fn();
export const verifyUserEmail = jest.fn();
export const sendVerificationEmailToUser = jest.fn();
export const resetPassword = jest.fn(); 