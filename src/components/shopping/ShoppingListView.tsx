import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RecipeProgressCard } from "./RecipeProgressCard";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "./types";

interface ShoppingListViewProps {
  recipes: Recipe[];
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  viewMode: "list" | "recipe";
}

export function ShoppingListView({
  recipes,
  ingredients,
  checkedItems,
  onCheck,
  viewMode
}: ShoppingListViewProps) {
  console.log("ShoppingListView - Current view mode:", viewMode);

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
  console.log("Sorted ingredients count:", sortedIngredients.length);

  return (
    <div className="space-y-6">
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