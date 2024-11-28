import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types/recipe";

interface RecipeHeaderProps {
  isEditing: boolean;
  recipe: Recipe;
  onRecipeChange: (updates: Partial<Recipe>) => void;
  isStepBased: boolean;
  onStepBasedChange: (value: boolean) => void;
  onSaveAsDraft?: () => void;
}

export function RecipeHeader({
  isEditing,
  recipe,
  onRecipeChange,
  isStepBased,
  onStepBasedChange,
  onSaveAsDraft
}: RecipeHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="privacy"
              checked={recipe.privacy === 'private'}
              onCheckedChange={(checked) => 
                onRecipeChange({ privacy: checked ? 'private' : 'public' })
              }
            />
            <Label htmlFor="privacy">Private Recipe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="step-based"
              checked={isStepBased}
              onCheckedChange={onStepBasedChange}
            />
            <Label htmlFor="step-based">Step-based Recipe</Label>
          </div>
          {onSaveAsDraft && (
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
            >
              Save as Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}