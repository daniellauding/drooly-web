import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";

interface RecipeHeaderSectionProps {
  isEditing: boolean;
  onSaveAsDraft?: () => void;
}

export function RecipeHeaderSection({
  isEditing,
  onSaveAsDraft,
}: RecipeHeaderSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <div className="flex items-center gap-4">
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