import { Button } from "@/components/ui/button";
import { AISuggestions } from "./AISuggestions";
import { Recipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

interface RecipeHeaderProps {
  isEditing: boolean;
  recipe: Recipe;
  onRecipeChange: (updates: Partial<Recipe>) => void;
  isStepBased: boolean;
  onStepBasedChange: (value: boolean) => void;
}

export function RecipeHeader({ 
  isEditing, 
  recipe, 
  onRecipeChange,
  isStepBased,
  onStepBasedChange
}: RecipeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <AISuggestions
            onSuggestionsApply={onRecipeChange}
            currentRecipe={recipe}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Step-based creation</span>
            <Switch
              checked={isStepBased}
              onCheckedChange={onStepBasedChange}
            />
          </div>
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