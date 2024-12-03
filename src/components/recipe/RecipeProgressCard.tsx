import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { useState } from "react";
import { CustomIngredientAdd } from "../shopping/CustomIngredientAdd";

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
  onRemove: (ingredient: IngredientItem) => void;
  onUpdate: (ingredient: IngredientItem, updates: Partial<IngredientItem>) => void;
}

export function RecipeProgressCard({
  recipe,
  ingredients,
  progress,
  checkedItems,
  onCheck,
  onRemove,
  onUpdate
}: RecipeProgressCardProps) {
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

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
      </div>
      <div className="mb-4">
        <Progress value={progress.percentage} />
        <p className="text-sm text-muted-foreground mt-1">
          {progress.checked} of {progress.total} ingredients checked
        </p>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient, idx) => (
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
                  <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
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

        <div className="mt-4 pt-4 border-t">
          <CustomIngredientAdd 
            onAdd={(name, amount, unit) => {
              console.log("Adding custom ingredient to recipe:", recipe.title);
              onCheck({
                name,
                amount,
                unit,
                recipeId: recipe.id,
                recipeTitle: recipe.title,
                bought: false
              });
            }} 
          />
        </div>
      </div>
    </Card>
  );
}