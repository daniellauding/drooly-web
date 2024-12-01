import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

export function ShoppingListView({
  recipes,
  ingredients,
  checkedItems,
  onCheck
}: ShoppingListViewProps) {
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

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Ingredients</TabsTrigger>
        <TabsTrigger value="by-recipe">By Recipe</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <Card className="p-6">
          {ingredients.map((ingredient, idx) => (
            <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
              <div className="flex items-center gap-4 py-2">
                <Checkbox
                  checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                  onCheckedChange={() => onCheck(ingredient)}
                />
                <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {ingredient.recipeTitle}
                </span>
              </div>
              {idx < ingredients.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="by-recipe" className="mt-6">
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
      </TabsContent>
    </Tabs>
  );
}