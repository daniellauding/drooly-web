import { Recipe } from "@/types/recipe";

export interface FilterOptions {
  difficulty?: string;
  cuisine?: string;
  cookingTime?: string;
  dietary?: string[];
  searchQuery?: string;
}

export const filterRecipes = (recipes: Recipe[], filters: FilterOptions): Recipe[] => {
  return recipes.filter(recipe => {
    // Apply difficulty filter
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Apply cuisine filter
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    // Apply cooking time filter
    if (filters.cookingTime) {
      const time = parseInt(recipe.totalTime || '0');
      const filterTime = parseInt(filters.cookingTime);
      if (time > filterTime) {
        return false;
      }
    }

    // Apply dietary filters
    if (filters.dietary?.length) {
      const recipeDietary = recipe.dietary || [];
      if (!filters.dietary.every(diet => recipeDietary.includes(diet))) {
        return false;
      }
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `
        ${recipe.title} 
        ${recipe.description} 
        ${recipe.ingredients?.map(i => i.name).join(' ')}
      `.toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
};