import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Define log groups
const LOG_GROUPS = {
  SYSTEM: '🔧 System',
  AUTH: '🔑 Authentication',
  DATA: '💾 Data Operations',
  UI: '🎨 UI Events'
};

export const logSystemInfo = () => {
  console.group(LOG_GROUPS.SYSTEM);
  console.log('Environment:', import.meta.env.VITE_APP_ENV);
  console.log('Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log('API URL:', import.meta.env.VITE_API_URL);
  console.groupEnd();
};

export const logAppState = async (userId: string) => {
  console.group('Application State');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      console.group('User Data');
      console.log('User ID:', userId);
      
      if (userDoc.exists()) {
        console.log('User Document:', {
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate?.()
        });
      }
      console.groupEnd();
    }

    // Log collections
    const collections = {
      recipes: await getDocs(collection(db, 'recipes')),
      ingredients: await getDocs(collection(db, 'ingredients')),
      events: await getDocs(collection(db, 'events')),
      ...(userId && {
        todos: await getDocs(collection(db, `users/${userId}/todos`))
      })
    };

    // Log each collection
    Object.entries(collections).forEach(([name, snapshot]) => {
      console.group(name.toUpperCase());
      console.log(`Total documents: ${snapshot.size}`);
      console.groupEnd();
    });

    console.log('✅ Debug info collected successfully');
  } catch (error) {
    console.error('Error logging app state:', error);
  }

  console.groupEnd();
}; 