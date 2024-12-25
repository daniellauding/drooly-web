import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { logger, LOG_GROUPS } from './logger';

export const logAppState = async (userId: string | null) => {
  logger.group(LOG_GROUPS.DATA, 'Application State');
  logger.log(LOG_GROUPS.DATA, `Timestamp: ${new Date().toISOString()}`);

  try {
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      logger.group(LOG_GROUPS.AUTH, 'User Data');
      logger.log(LOG_GROUPS.AUTH, 'User ID:', userId);
      
      if (userDoc.exists()) {
        logger.log(LOG_GROUPS.AUTH, 'User Document:', {
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate?.()
        });
      }
      logger.groupEnd();
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
      logger.logCollection(LOG_GROUPS.DATA, name.toUpperCase(), snapshot);
    });

    logger.log(LOG_GROUPS.DATA, '✅ Debug info collected successfully');
  } catch (error) {
    logger.log(LOG_GROUPS.DATA, '❌ Error collecting debug info:', error);
  }

  logger.groupEnd();
}; 