export interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
  recipeId: string;
  recipeTitle: string;
  bought: boolean;
  recurrence?: "none" | "weekly" | "monthly";
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