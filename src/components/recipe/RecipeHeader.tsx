import { Button } from "@/components/ui/button";
import { AISuggestions } from "./AISuggestions";
import { Recipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";

interface RecipeHeaderProps {
  isEditing: boolean;
  recipe: Recipe;
  onRecipeChange: (updates: Partial<Recipe>) => void;
}

export function RecipeHeader({ isEditing, recipe, onRecipeChange }: RecipeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {isEditing ? "Edit Recipe" : "Create New Recipe"}
      </h1>
      <div className="flex items-center gap-4">
        <AISuggestions
          onSuggestionsApply={onRecipeChange}
          currentRecipe={recipe}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}