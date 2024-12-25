import { auth, db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const checkSystemStatus = async () => {
  console.group('🔧 System Status Check');
  const startTime = performance.now();

  // Check Firebase Auth Status
  console.log('Checking Auth Service...');
  const authStatus = auth.currentUser 
    ? `Authenticated as ${auth.currentUser.email}` 
    : 'Not authenticated';
  console.log('Auth Status:', authStatus);

  // Check Firestore Connection
  console.log('Checking Firestore Connection...');
  try {
    const testQuery = query(collection(db, 'recipes'), limit(1));
    await getDocs(testQuery);
    console.log('✅ Firestore Connection: OK');
  } catch (error) {
    console.error('❌ Firestore Connection Failed:', error);
  }

  // Check Browser Features
  console.log('Browser Features:');
  console.log('- IndexedDB:', window.indexedDB ? '✓ Available' : '❌ Not Available');
  console.log('- ServiceWorker:', 'serviceWorker' in navigator ? '✓ Available' : '❌ Not Available');
  console.log('- WebSocket:', 'WebSocket' in window ? '✓ Available' : '❌ Not Available');

  const endTime = performance.now();
  console.log(`System check completed in ${(endTime - startTime).toFixed(2)}ms`);
  console.groupEnd();
}; 