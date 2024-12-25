import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Define log groups
export const LOG_GROUPS = {
  AUTH: 'Authentication',
  DATA: 'Data',
  ERROR: 'Error'
} as const;

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