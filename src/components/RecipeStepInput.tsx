import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Trash2, Video } from "lucide-react";
import { RecipeStep } from "@/types/recipe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { useState } from "react";
import { IngredientSuggestions } from "./ingredients/IngredientSuggestions";

interface RecipeStepInputProps {
  step: RecipeStep;
  onChange: (step: RecipeStep) => void;
  onDelete: () => void;
  ingredientGroups?: string[];
}

export function RecipeStepInput({ step, onChange, onDelete, ingredientGroups = [] }: RecipeStepInputProps) {
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showIngredientSearch, setShowIngredientSearch] = useState(false);

  const handleIngredientSelect = (ingredientName: string) => {
    onChange({
      ...step,
      ingredients: [...(step.ingredients || []), {
        name: ingredientName,
        amount: "1",
        unit: "piece",
        group: step.ingredientGroup || "Main Ingredients"
      }]
    });
    setShowIngredientSearch(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Step title"
          value={step.title}
          onChange={(e) => onChange({ ...step, title: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Duration (e.g., 10 min)"
          value={step.duration}
          onChange={(e) => onChange({ ...step, duration: e.target.value })}
          className="w-32"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {ingredientGroups.length > 0 && (
        <Select
          value={step.ingredientGroup}
          onValueChange={(value) => onChange({ ...step, ingredientGroup: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ingredient group for this step" />
          </SelectTrigger>
          <SelectContent>
            {ingredientGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowIngredientSearch(true)}
          className="w-full justify-start text-left"
        >
          Add ingredients to this step
        </Button>

        {showIngredientSearch && (
          <div className="absolute z-50 w-full mt-1">
            <IngredientSuggestions
              onSelect={handleIngredientSelect}
              onClose={() => setShowIngredientSearch(false)}
            />
          </div>
        )}
      </div>

      {step.ingredients && step.ingredients.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Step Ingredients</h4>
          <div className="space-y-2">
            {step.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{ingredient.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newIngredients = step.ingredients?.filter((_, i) => i !== index);
                    onChange({ ...step, ingredients: newIngredients });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Textarea
        placeholder="Step instructions"
        value={step.instructions}
        onChange={(e) => onChange({ ...step, instructions: e.target.value })}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          className="gap-2"
        >
          <Image className="h-4 w-4" />
          Add Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          className="gap-2"
        >
          <Video className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {showMediaUpload && (
        <ImageUpload
          images={step.media || []}
          featuredImageIndex={0}
          onChange={(media) => onChange({ ...step, media })}
        />
      )}
    </div>
  );
}