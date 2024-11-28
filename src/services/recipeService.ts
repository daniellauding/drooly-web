import { Timestamp, doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Recipe, Ingredient, RecipeStep } from '@/types/recipe';

export type { Recipe, Ingredient, RecipeStep };

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const recipeRef = doc(db, 'recipes', id);
  const recipeDoc = await getDoc(recipeRef);
  
  if (!recipeDoc.exists()) {
    throw new Error('Recipe not found');
  }

  const data = recipeDoc.data();
  return {
    id: recipeDoc.id,
    ...data,
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: data.updatedAt || Timestamp.now()
  } as Recipe;
};

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const recipesRef = collection(db, 'recipes');
  const q = query(
    recipesRef,
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt || Timestamp.now(),
    updatedAt: doc.data().updatedAt || Timestamp.now()
  } as Recipe));
};