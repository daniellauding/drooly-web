import '@testing-library/jest-dom';
import { expect, jest } from '@jest/globals';

// Mock Firebase
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/analytics');
jest.mock('firebase/functions');

// Mock services
jest.mock('@/services/analyticsService');
jest.mock('@/services/authService');

// Mock Firebase lib
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn()
  },
  firebaseConfig: {
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    projectId: 'test-project-id',
    storageBucket: 'test-storage-bucket',
    messagingSenderId: 'test-sender-id',
    appId: 'test-app-id',
    measurementId: 'test-measurement-id'
  }
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

Object.defineProperty(global, 'expect', {
  value: expect
});

Object.defineProperty(global, 'jest', {
  value: jest
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}); 