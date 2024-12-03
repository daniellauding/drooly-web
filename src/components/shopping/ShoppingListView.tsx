import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RecipeProgressCard } from "./RecipeProgressCard";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ShoppingListViewProps {
  recipes: Recipe[];
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
}

export function ShoppingListView({
  recipes,
  ingredients,
  checkedItems,
  onCheck
}: ShoppingListViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "recipe">("list");
  console.log("Current view mode:", viewMode); // Debug log

  const calculateProgress = (recipeId: string) => {
    const recipeIngredients = ingredients.filter(ing => ing.recipeId === recipeId);
    const total = recipeIngredients.length;
    const checked = recipeIngredients.filter(ing => 
      checkedItems.has(`${ing.recipeId}-${ing.name}`)
    ).length;
    return {
      total,
      checked,
      percentage: total > 0 ? (checked / total) * 100 : 0
    };
  };

  const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
  console.log("Sorted ingredients count:", sortedIngredients.length); // Debug log

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="text-lg font-semibold">Shopping List</h2>
        <Select 
          value={viewMode} 
          onValueChange={(value: "list" | "recipe") => {
            console.log("Changing view mode to:", value); // Debug log
            setViewMode(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">All Ingredients</SelectItem>
            <SelectItem value="recipe">Group by Recipe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === "list" ? (
        <Card className="p-6">
          {sortedIngredients.map((ingredient, idx) => (
            <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
              <div className="flex items-center gap-4 py-2">
                <Checkbox
                  checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                  onCheckedChange={() => onCheck(ingredient)}
                />
                <div className="flex-1">
                  <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({ingredient.recipeTitle})
                  </span>
                </div>
              </div>
              {idx < ingredients.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      ) : (
        <div className="space-y-6">
          {recipes.map(recipe => (
            <RecipeProgressCard
              key={recipe.id}
              recipe={recipe}
              ingredients={ingredients.filter(ing => ing.recipeId === recipe.id)}
              progress={calculateProgress(recipe.id)}
              checkedItems={checkedItems}
              onCheck={onCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
}