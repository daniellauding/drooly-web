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

  return (
    <TableRow>
      <TableCell colSpan={8} className="bg-muted/30 p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={() => onSave({ description })}>
            Save Changes
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}