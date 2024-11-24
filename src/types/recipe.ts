export interface RecipeStep {
  title: string;
  instructions: string;
  duration: string;
  ingredientGroup?: string;
  media?: string[];
}

export interface Recipe {
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
}

export const validateRecipe = (recipe: Recipe): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!recipe.title.trim()) {
    errors.push("Title is required");
  }

  if (!recipe.description.trim()) {
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
    if (!step.title.trim()) {
      errors.push(`Step ${index + 1} requires a title`);
    }
    if (!step.instructions.trim()) {
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