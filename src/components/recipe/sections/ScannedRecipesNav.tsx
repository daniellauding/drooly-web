import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";

interface ScannedRecipesNavProps {
  scannedRecipes: Partial<Recipe>[];
  activeRecipeIndex: number;
  onRecipeSelect: (index: number) => void;
}

export function ScannedRecipesNav({
  scannedRecipes,
  activeRecipeIndex,
  onRecipeSelect
}: ScannedRecipesNavProps) {
  if (scannedRecipes.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {scannedRecipes.map((_, index) => (
        <Button
          key={index}
          variant={activeRecipeIndex === index ? "default" : "outline"}
          onClick={() => onRecipeSelect(index)}
        >
          Recipe {index + 1}
        </Button>
      ))}
    </div>
  );
}