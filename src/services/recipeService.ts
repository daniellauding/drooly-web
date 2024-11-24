import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  difficulty: string;
  chef: string;
  date: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  creatorId: string;
}

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes from Firestore');
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Recipe[];
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

    return {
      id: recipeDoc.id,
      ...recipeDoc.data()
    } as Recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};