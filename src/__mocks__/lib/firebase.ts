import { jest } from '@jest/globals';

// Mock Firebase auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
};

// Mock Firestore
export const db = {
  collection: jest.fn(),
  doc: jest.fn()
};

// Mock Firebase config
export const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-auth-domain',
  projectId: 'test-project-id',
  storageBucket: 'test-storage-bucket',
  messagingSenderId: 'test-sender-id',
  appId: 'test-app-id',
  measurementId: 'test-measurement-id'
};

// Mock Firebase initialization
export const initializeApp = jest.fn(() => ({
  auth: () => auth,
  firestore: () => db
})); 