import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const validateApiKey = (apiKey: string | undefined) => {
  if (!apiKey) {
    throw new Error('API key is missing');
  }
  
  // Firebase Web API keys typically start with 'AIza'
  if (!apiKey.startsWith('AIza')) {
    console.error('API key format seems incorrect (should start with AIza)');
    return false;
  }
  
  return true;
};

console.log('Current Environment Mode:', import.meta.env.MODE);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate API key before initialization
if (!validateApiKey(firebaseConfig.apiKey)) {
  throw new Error('Invalid API key format');
}

// Debug config loading (safely)
console.log('Firebase Config Validation:', {
  apiKeyFormat: firebaseConfig.apiKey?.startsWith('AIza'),
  apiKeyLength: firebaseConfig.apiKey?.length,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
auth.useDeviceLanguage();

const actionCodeSettings = {
  url: `${window.location.origin}/verify-email`,
  handleCodeInApp: true
};

export const db = getFirestore(app);
export const storage = getStorage(app);
export { app, auth, actionCodeSettings };