import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "./types";

interface RecipeProgressCardProps {
  recipe: Recipe;
  ingredients: IngredientItem[];
  progress: {
    total: number;
    checked: number;
    percentage: number;
  };
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
}

export function RecipeProgressCard({ recipe, ingredients, progress, checkedItems, onCheck }: RecipeProgressCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChefHat className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
      </div>
      <div className="mb-4">
        <Progress value={progress?.percentage || 0} />
        <p className="text-sm text-muted-foreground mt-1">
          {progress?.checked || 0} of {progress?.total || 0} ingredients checked
        </p>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient, idx) => (
          <div key={`${recipe.id}-${ingredient.name}-${idx}`}>
            <div className="flex items-center gap-4 py-2">
              <Checkbox
                checked={checkedItems.has(`${recipe.id}-${ingredient.name}`)}
                onCheckedChange={() => onCheck(ingredient)}
              />
              <span className={checkedItems.has(`${recipe.id}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </span>
            </div>
            {idx < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </Card>
  );
}