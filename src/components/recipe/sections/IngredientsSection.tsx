import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ingredient } from "@/types/recipe";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
}

export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <Card className="p-4 sm:p-6 rounded-xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ingredients</h2>
        <p className="text-muted-foreground">No ingredients listed for this recipe.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 rounded-xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ingredients</h2>
      <ScrollArea className="h-[250px] sm:h-[300px] pr-4">
        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
                {ingredient.group && ingredient.group !== "Main Ingredients" && (
                  <span className="text-muted-foreground ml-2">({ingredient.group})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  );
}