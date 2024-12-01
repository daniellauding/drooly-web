export interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
  recipeId: string;
  recipeTitle: string;
  bought: boolean;
}

export interface RecipeProgress {
  total: number;
  checked: number;
  percentage: number;
}

export interface SharedList {
  owner: string;
  sharedWith: string;
  createdAt: Date;
}