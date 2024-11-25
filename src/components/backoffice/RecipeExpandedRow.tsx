import { Recipe } from "@/types/recipe";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RecipeExpandedRowProps {
  recipe: Recipe;
  onSave: (updates: Partial<Recipe>) => Promise<void>;
}

export function RecipeExpandedRow({ recipe, onSave }: RecipeExpandedRowProps) {
  const [description, setDescription] = useState(recipe.description);

  const renderArrayField = (field: string[], label: string) => (
    <div className="mb-4">
      <h4 className="font-medium mb-2">{label}:</h4>
      <div className="flex flex-wrap gap-2">
        {field.map((item, index) => (
          <span key={index} className="bg-muted px-2 py-1 rounded text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <TableRow>
      <TableCell colSpan={8} className="bg-muted/30 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <p>{recipe.difficulty}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cuisine</label>
                  <p>{recipe.cuisine}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Time & Servings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Total Time</label>
                  <p>{recipe.totalTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Servings</label>
                  <p>{recipe.servings.amount} {recipe.servings.unit}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Recipe Details</h3>
            {recipe.cookingMethods && renderArrayField(recipe.cookingMethods, "Cooking Methods")}
            {recipe.dishTypes && renderArrayField(recipe.dishTypes, "Dish Types")}
            {recipe.equipment && renderArrayField(recipe.equipment, "Required Equipment")}
            {recipe.categories && renderArrayField(recipe.categories, "Categories")}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Dietary Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(recipe.dietaryInfo).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? "✓" : "✗"}
                  </span>
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Estimated Cost</label>
                <p>{recipe.estimatedCost}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Season</label>
                <p>{recipe.season}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Occasion</label>
                <p>{recipe.occasion}</p>
              </div>
            </div>
          </div>

          <Button onClick={() => onSave({ description })}>
            Save Changes
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}