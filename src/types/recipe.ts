export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  group: string;
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  difficulty: string;
  cookingMethods: string[];
  cuisine: string;
  dishTypes: string[];
  images: string[];
  featuredImageIndex: number;
  ingredients: any[];
  servings: {
    amount: number;
    unit: string;
  };
  steps: RecipeStep[];
  tags: string[];
  totalTime: string;
  worksWith: string[];
  serveWith: string[];
  dietaryInfo?: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    containsNuts: boolean;
  };
  categories: string[];
  estimatedCost: string;
  equipment: string[];
  season?: string;
  occasion?: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
  creatorId?: string;
  creatorName?: string;
  status?: string;
  image?: string;
  chef?: string;
  date?: string;
  cookTime?: string;
  source?: 'image' | 'scrape' | 'ai' | 'manual' | 'trello';
  sourceUrl?: string;
  privacy?: 'public' | 'private' | 'unlisted';
  stats?: {
    views: number;
    likes: string[];
    comments: number;
  };
  ingredientSections?: {
    title: string;
    ingredients: string[];
  }[];
}

export interface RecipeStep {
  title: string;
  instructions: string;
  duration: string;
  ingredientGroup?: string;
  media?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

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

  // Difficulty validation
  if (!recipe.difficulty) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty level is required'
    });
  }

  // Ingredients validation
  if (recipe.ingredients.length === 0) {
    errors.push({
      field: 'ingredients',
      message: 'At least one ingredient is required'
    });
  } else {
    recipe.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name?.trim()) {
        errors.push({
          field: 'ingredients',
          message: `Ingredient ${index + 1} requires a name`
        });
      }
      if (!ingredient.amount?.trim()) {
        errors.push({
          field: 'ingredients',
          message: `Ingredient ${index + 1} requires an amount`
        });
      }
    });
  }

  // Steps validation
  if (recipe.steps.length === 0) {
    errors.push({
      field: 'steps',
      message: 'At least one step is required'
    });
  } else {
    recipe.steps.forEach((step, index) => {
      if (!step.title?.trim()) {
        errors.push({
          field: 'steps',
          message: `Step ${index + 1} requires a title`
        });
      }
      if (!step.instructions?.trim()) {
        errors.push({
          field: 'steps',
          message: `Step ${index + 1} requires instructions`
        });
      }
    });
  }

  // Servings validation
  if (!recipe.servings.amount || !recipe.servings.unit) {
    errors.push({
      field: 'servings',
      message: 'Servings amount and unit are required'
    });
  }

  // Cooking time validation
  if (!recipe.totalTime?.trim()) {
    errors.push({
      field: 'totalTime',
      message: 'Total cooking time is required'
    });
  }

  // Categories validation
  if (recipe.categories.length === 0) {
    errors.push({
      field: 'categories',
      message: 'Select at least one category'
    });
  }

  // Equipment validation
  if (recipe.equipment.length === 0) {
    errors.push({
      field: 'equipment',
      message: 'Select at least one piece of equipment'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

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
