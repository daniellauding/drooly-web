import { Recipe } from "@/types/recipe";

export interface Filters {
  ingredients?: string[];
  categories?: string[];
  dietary?: string[];
  difficulty?: string[];
  cuisine?: string[];
  estimatedCost?: string[];
  season?: string[];
  occasion?: string[];
  equipment?: string[];
  dishTypes?: string[];
  cookingMethods?: string[];
  cookingTime?: number[];
}

export const filterRecipes = (recipes: Recipe[], searchQuery: string, activeFilters: Filters) => {
  console.log('Filtering recipes. Total before filter:', recipes.length);
  
  return recipes.filter(recipe => {
    const searchMatch = !searchQuery || 
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.chef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!searchMatch) return false;

    const filterMatches = Object.entries(activeFilters).every(([key, values]) => {
      if (!values || (Array.isArray(values) && values.length === 0)) {
        return true;
      }

      switch (key) {
        case 'ingredients':
          return values.some(ingredient => 
            recipe.ingredients?.some(ri => 
              ri.name.toLowerCase().includes(ingredient.toLowerCase())
            )
          );
        case 'cookingTime':
          if (Array.isArray(values) && values.length === 2) {
            const time = parseInt(recipe.cookTime || '0');
            return time >= values[0] && time <= values[1];
          }
          return true;
        case 'difficulty':
          return values.includes(recipe.difficulty);
        case 'cuisine':
          return values.includes(recipe.cuisine);
        case 'categories':
          return values.some(category => 
            recipe.categories?.includes(category)
          );
        case 'dietary':
          return values.every(requirement => 
            recipe.dietaryInfo?.[requirement as keyof typeof recipe.dietaryInfo] || false
          );
        case 'equipment':
          return values.some(equipment => 
            recipe.equipment?.includes(equipment)
          );
        case 'dishTypes':
          return values.some(dishType => 
            recipe.dishTypes?.includes(dishType)
          );
        default:
          return true;
      }
    });

    return filterMatches;
  });
};