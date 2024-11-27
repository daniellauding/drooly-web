import { Recipe } from '@/types/recipe';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SAMPLE_RECIPES } from '@/data/sampleRecipes';
import { formatRecipeData } from '@/utils/recipeFormatters';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes...');
  try {
    const firebaseRecipes = await fetchFirebaseRecipes();
    console.log('Successfully fetched recipes:', firebaseRecipes.length);
    return firebaseRecipes;
  } catch (error) {
    console.error('Error fetching recipes, falling back to sample data:', error);
    return SAMPLE_RECIPES;
  }
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  console.log('Fetching recipe by id:', id);
  try {
    const recipeDoc = await getDoc(doc(db, 'recipes', id));
    if (!recipeDoc.exists()) {
      console.log('No recipe found with id:', id);
      return null;
    }
    const recipeData = formatRecipeData(recipeDoc);
    console.log('Successfully fetched recipe:', recipeData);
    return recipeData;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};