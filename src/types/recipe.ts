import { Recipe as ServiceRecipe } from '@/services/recipeService';

// Re-export the Recipe type from the service
export type Recipe = ServiceRecipe;

export const CUISINES = [
  "American", "Italian", "Japanese", "Mexican", "Indian", "French", "Thai", 
  "Mediterranean", "Chinese", "Korean", "Vietnamese", "Greek", "Spanish", 
  "Middle Eastern", "Brazilian", "Caribbean", "Ethiopian", "German", "Turkish"
];

export const RECIPE_CATEGORIES = [
  "Family Friendly",
  "Fast & Easy",
  "Budget Friendly",
  "Meal Prep",
  "Healthy",
  "Comfort Food",
  "Party Food",
  "Gourmet",
  "One Pot Meal",
  "Low Carb",
  "High Protein",
  "Student Friendly",
  "Office Lunch",
  "Kids Favorite"
];

export const OCCASIONS = [
  "Christmas",
  "Thanksgiving",
  "Easter",
  "Halloween",
  "New Year",
  "Valentine's Day",
  "Birthday",
  "Game Day",
  "Summer BBQ",
  "Picnic",
  "Potluck",
  "Wedding"
];

export const SEASONS = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "Year Round"
];

export const COOKING_EQUIPMENT = [
  "Oven",
  "Stovetop",
  "Grill",
  "Slow Cooker",
  "Pressure Cooker",
  "Air Fryer",
  "BBQ",
  "Smoker",
  "Dutch Oven",
  "Wok",
  "Outdoor Fire",
  "No Cooking Required"
];

export const COST_CATEGORIES = [
  "Under $5",
  "$5-$10",
  "$10-$20",
  "$20-$30",
  "$30+"
];

export const validateRecipe = (recipe: Recipe): ValidationResult => {
  const errors: { field: string; message: string }[] = [];

  // Title validation
  if (!recipe.title?.trim()) {
    errors.push({
      field: 'title',
      message: 'Recipe title is required'
    });
  } else if (recipe.title.length < 3) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 3 characters long'
    });
  }

  // Description validation
  if (!recipe.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Recipe description is required'
    });
  }

  // Ingredients validation
  if (recipe.ingredients.length === 0) {
    errors.push({
      field: 'ingredients',
      message: 'At least one ingredient is required'
    });
  }

  // Servings validation - only if provided
  if (recipe.servings.amount && !recipe.servings.unit) {
    errors.push({
      field: 'servings',
      message: 'Servings unit is required when amount is specified'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}
