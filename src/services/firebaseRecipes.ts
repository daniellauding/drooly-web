import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';

export const fetchFirebaseRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes from Firebase...');
  const recipesRef = collection(db, 'recipes');
  const q = query(
    recipesRef, 
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log('No recipes found in Firebase');
    return [];
  }

  console.log(`Found ${querySnapshot.size} recipes in Firebase`);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      image: data.images?.[data.featuredImageIndex || 0],
      chef: data.creatorName || 'Anonymous',
      date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
      cookTime: `${data.totalTime || 30} min`,
    } as Recipe;
  });
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  console.log('Fetching recipe by ID:', id);
  try {
    const recipeRef = doc(db, 'recipes', id);
    const recipeDoc = await getDoc(recipeRef);
    
    if (!recipeDoc.exists()) {
      return null;
    }

    const data = recipeDoc.data();
    return {
      ...data,
      id: recipeDoc.id,
      image: data.images?.[data.featuredImageIndex || 0],
      chef: data.creatorName || 'Anonymous',
      date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
      cookTime: `${data.totalTime || 30} min`,
    } as Recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};