import { auth, db, storage } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export async function checkSystemStatus() {
  console.group('🔍 System Status Check');
  
  try {
    // Check Firebase configuration matches environment
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const env = import.meta.env.VITE_APP_ENV;
    
    const expectedProject = {
      development: 'drooly-dev',
      staging: 'drooly-stage', 
      production: 'drooly'
    }[env];

    if (projectId !== expectedProject) {
      console.error(`❌ Wrong Firebase project for ${env} environment. Expected: ${expectedProject}, Got: ${projectId}`);
      return false;
    }

    // Basic connectivity check
    const testQuery = query(collection(db, 'system_status'), limit(1));
    await getDocs(testQuery);
    console.log('✅ Firebase connection OK');
    
    console.groupEnd();
    return true;

  } catch (error) {
    console.error('❌ System check failed:', error);
    console.groupEnd();
    return false;
  }
} 