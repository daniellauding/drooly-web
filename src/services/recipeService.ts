import { Recipe } from '@/types/recipe';
import { fetchFirebaseRecipes, fetchRecipeById } from './firebaseRecipes';
import { SAMPLE_RECIPES } from '@/data/sampleRecipes';

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

export { fetchRecipeById };
export type { Recipe };