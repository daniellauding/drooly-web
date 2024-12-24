import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Enhanced debugging information
console.log('🔥 Initializing Firebase with environment:', import.meta.env.VITE_APP_ENV);
console.log('📦 Connecting to Firebase project:', firebaseConfig.projectId);
console.log('🌐 Using Firebase domain:', firebaseConfig.authDomain);
console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: '***' + firebaseConfig.apiKey.slice(-6), // Show only last 6 chars of API key for security
});

const app = initializeApp(firebaseConfig);
console.log('✅ Firebase initialization complete');

export const auth = getAuth(app);
console.log('🔐 Firebase Auth initialized');

export const db = getFirestore(app);
console.log('💾 Firestore database initialized');

// Log environment-specific information
const envInfo = {
  development: '🟡 Development environment - using development database',
  staging: '🟠 Staging environment - using staging database',
  production: '🟢 Production environment - using production database'
};

console.log(envInfo[import.meta.env.VITE_APP_ENV as keyof typeof envInfo] || '⚪ Unknown environment');