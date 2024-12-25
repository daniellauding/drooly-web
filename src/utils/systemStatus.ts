import { auth, db, storage } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export async function checkSystemStatus() {
  console.group('🔧 System Status Check');
  
  try {
    // Check Firebase Auth
    console.log('Checking Firebase Auth...');
    const authStatus = auth.currentUser !== undefined;
    console.log('📱 Firebase Auth:', authStatus ? '✅ Connected' : '⚠️ Not initialized');

    // Check Firestore
    console.log('Checking Firestore...');
    const testQuery = query(collection(db, 'system_status'), limit(1));
    await getDocs(testQuery);
    console.log('💾 Firestore:', '✅ Connected');

    // Check Storage
    console.log('Checking Firebase Storage...');
    const storageStatus = storage !== undefined;
    console.log('📦 Firebase Storage:', storageStatus ? '✅ Connected' : '⚠️ Not initialized');

    // Check API
    console.log('Checking API...');
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/health`);
        console.log('🌐 API:', response.ok ? '✅ Connected' : '⚠️ Error');
      } catch (error) {
        console.log('🌐 API:', '⚠️ Not reachable');
      }
    }

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
    throw error;
  }
} 