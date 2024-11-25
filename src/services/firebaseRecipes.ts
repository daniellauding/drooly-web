import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';

const FALLBACK_IMAGE = "/placeholder.svg";

export const fetchFirebaseRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes from Firebase...');
  try {
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
      console.log('Processing recipe:', doc.id, data);
      
      // Format the image URL, replacing blob URLs with fallback
      const imageUrl = data.images?.[data.featuredImageIndex || 0];
      const validImage = imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : FALLBACK_IMAGE;

      // Format the date
      const date = data.createdAt 
        ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
        : 'Recently added';

      // Format cooking time with fallback
      const cookTime = data.totalTime || '30 min';

      return {
        id: doc.id,
        ...data,
        image: validImage,
        chef: data.creatorName || 'Anonymous Chef',
        date,
        cookTime,
        title: data.title || 'Untitled Recipe',
        description: data.description || 'A delicious recipe waiting to be discovered',
        difficulty: data.difficulty || 'Medium',
        cuisine: data.cuisine || 'International',
      } as Recipe;
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
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
    const imageUrl = data.images?.[data.featuredImageIndex || 0];
    const validImage = imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : FALLBACK_IMAGE;

    return {
      ...data,
      id: recipeDoc.id,
      image: validImage,
      chef: data.creatorName || 'Anonymous Chef',
      date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Recently added',
      cookTime: data.totalTime || '30 min',
      title: data.title || 'Untitled Recipe',
      description: data.description || 'A delicious recipe waiting to be discovered',
      difficulty: data.difficulty || 'Medium',
      cuisine: data.cuisine || 'International',
    } as Recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};