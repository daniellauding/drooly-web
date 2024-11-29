import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { Save } from "lucide-react";

interface RecipeHeaderProps {
  isEditing: boolean;
  recipe: Recipe;
  onSaveAsDraft?: () => void;
}

export function RecipeHeader({
  isEditing,
  recipe,
  onSaveAsDraft
}: RecipeHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <div className="flex items-center gap-4">
          {onSaveAsDraft && (
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}