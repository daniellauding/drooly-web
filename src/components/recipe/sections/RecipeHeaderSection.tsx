import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types/recipe";

interface RecipeHeaderSectionProps {
  isEditing: boolean;
  onSaveAsDraft?: () => void;
  isStepBased?: boolean;
  onStepBasedChange?: (enabled: boolean) => void;
}

export function RecipeHeaderSection({
  isEditing,
  onSaveAsDraft,
  isStepBased = false,
  onStepBasedChange
}: RecipeHeaderSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <div className="flex items-center gap-4">
          {onStepBasedChange && (
            <div className="flex items-center gap-2">
              <Switch
                id="step-based"
                checked={isStepBased}
                onCheckedChange={onStepBasedChange}
              />
              <Label htmlFor="step-based">Step-based Recipe</Label>
            </div>
          )}
          {onSaveAsDraft && (
            <Button variant="outline" onClick={onSaveAsDraft}>
              Save as Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}