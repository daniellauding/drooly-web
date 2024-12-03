import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { RecipeProgressCard } from "../recipe/RecipeProgressCard";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "./types";
import { useState } from "react";
import { CustomIngredientAdd } from "./CustomIngredientAdd";

interface ShoppingListViewProps {
  recipes: Recipe[];
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  onRemove: (ingredient: IngredientItem) => void;
  onUpdate: (ingredient: IngredientItem, updates: Partial<IngredientItem>) => void;
  viewMode: "list" | "recipe";
}

export function ShoppingListView({
  recipes,
  ingredients,
  checkedItems,
  onCheck,
  onRemove,
  onUpdate,
  viewMode
}: ShoppingListViewProps) {
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const handleEdit = (ingredient: IngredientItem) => {
    setEditingIngredient(`${ingredient.recipeId}-${ingredient.name}`);
    setEditAmount(ingredient.amount);
    setEditUnit(ingredient.unit);
  };

  const handleSaveEdit = (ingredient: IngredientItem) => {
    onUpdate(ingredient, {
      amount: editAmount,
      unit: editUnit
    });
    setEditingIngredient(null);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditAmount("");
    setEditUnit("");
  };

  const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));

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
                {editingIngredient === `${ingredient.recipeId}-${ingredient.name}` ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-24"
                    />
                    <Select value={editUnit} onValueChange={setEditUnit}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece"].map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>{ingredient.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({ingredient.recipeTitle})
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveEdit(ingredient)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({ingredient.recipeTitle})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ingredient)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(ingredient)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
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
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}