export interface RecipeStep {
  title: string;
  instructions: string;
  duration: string;
  ingredientGroup?: string;
  media?: string[];
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

export const validateRecipe = (recipe: Recipe): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!recipe.title?.trim()) {
    errors.push("Title is required");
  }

  if (!recipe.description?.trim()) {
    errors.push("Description is required");
  }

  if (!recipe.difficulty) {
    errors.push("Difficulty level is required");
  }

  if (recipe.ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  }

  if (recipe.steps.length === 0) {
    errors.push("At least one step is required");
  }

  recipe.steps.forEach((step, index) => {
    if (!step.title?.trim()) {
      errors.push(`Step ${index + 1} requires a title`);
    }
    if (!step.instructions?.trim()) {
      errors.push(`Step ${index + 1} requires instructions`);
    }
  });

  if (!recipe.servings.amount || !recipe.servings.unit) {
    errors.push("Servings information is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
