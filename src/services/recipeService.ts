import { Recipe } from '@/types/recipe';
import { fetchFirebaseRecipes, fetchRecipeById } from './firebaseRecipes';
import { SAMPLE_RECIPES } from '@/data/sampleRecipes';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes...');
  try {
    const firebaseRecipes = await fetchFirebaseRecipes();
    if (firebaseRecipes.length > 0) {
      console.log('Using Firebase recipes');
      return firebaseRecipes;
    }
    
    console.log('No Firebase recipes found, using sample data');
    return SAMPLE_RECIPES;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return SAMPLE_RECIPES;
  }
};

export { fetchRecipeById };
export type { Recipe };