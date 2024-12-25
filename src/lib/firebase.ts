import { initializeApp, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.group('🔥 Firebase Initialization');
console.log('Environment:', import.meta.env.MODE);
console.log('Project ID:', firebaseConfig.projectId);
console.log('Storage Bucket:', firebaseConfig.storageBucket);
console.log('API Key:', firebaseConfig.apiKey ? '✓ Configured' : '❌ Missing');

let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase Core initialized successfully');
  
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
  // Enable offline persistence only in production or if explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERSISTENCE === 'true') {
    enableIndexedDbPersistence(db, {
      synchronizeTabs: true
    }).then(() => {
      console.log('✅ Firestore offline persistence enabled');
    }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ The current browser does not support persistence.');
      } else {
        console.warn('⚠️ Firestore persistence error:', err);
      }
    });
  }
  
  storage = getStorage(app);
  console.log('✅ Firebase Storage initialized');
  
  console.groupEnd();
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.groupEnd();
  throw error;
}

export { app, auth, db, storage };