import { auth, db, storage } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export async function checkSystemStatus() {
  console.group('🔧 System Status Check');
  
  try {
    // Check Firebase Auth
    console.log('Checking Firebase Auth...');
    const authInitialized = auth !== undefined;
    console.log('📱 Firebase Auth:', authInitialized ? '✅ Connected' : '⚠️ Not initialized');

    // Check Firestore
    console.log('Checking Firestore...');
    try {
      const testQuery = query(collection(db, 'system_status'), limit(1));
      await getDocs(testQuery);
      console.log('💾 Firestore:', '✅ Connected');
    } catch (error) {
      console.log('💾 Firestore:', '⚠️ Permission error - check security rules');
      // Don't throw here, continue checking other services
    }

    // Check Storage
    console.log('Checking Firebase Storage...');
    const storageStatus = storage !== undefined;
    console.log('📦 Firebase Storage:', storageStatus ? '✅ Connected' : '⚠️ Not initialized');

    // Log Firebase config
    console.group('📝 Firebase Configuration');
    console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
    console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
    console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
    console.groupEnd();

    console.groupEnd();
    return true;
  } catch (error) {
    console.error('System status check failed:', error);
    console.groupEnd();
    // Return false instead of throwing
    return false;
  }
} 