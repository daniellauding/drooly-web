import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';
import { Timestamp } from 'firebase/firestore';
import { SAMPLE_RECIPES } from '@/data/sampleRecipes';

const FALLBACK_IMAGE = "/placeholder.svg";

export const fetchFirebaseRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes from Firebase...');
  console.log('Current user:', auth.currentUser?.uid || 'Not authenticated');
  console.log('User email:', auth.currentUser?.email || 'No email');
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
      
      const imageUrl = data.images?.[data.featuredImageIndex || 0];
      const validImage = imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : FALLBACK_IMAGE;

      const date = data.createdAt 
        ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
        : 'Recently added';

      const cookTime = data.totalTime || '30 min';

      return {
        id: doc.id,
        ...data,
        images: data.images || [],
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        servings: data.servings || { amount: 4, unit: 'servings' },
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
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
    
    // Only fallback to sample data if it's a permission error (for local development)
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      console.log('Permission denied - falling back to sample recipes for local development...');
      return SAMPLE_RECIPES;
    }
    
    // For other errors, throw them so the app can handle them properly
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
      id: recipeDoc.id,
      ...data,
      images: data.images || [],
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      servings: data.servings || { amount: 4, unit: 'servings' },
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
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
    
    // Only fallback to sample data if it's a permission error (for local development)
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      console.log('Permission denied - falling back to sample recipe for local development...');
      return SAMPLE_RECIPES.find(recipe => recipe.id === id) || null;
    }
    
    // For other errors, throw them so the app can handle them properly
    throw error;
  }
};