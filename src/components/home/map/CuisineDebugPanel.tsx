import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CuisineDebugPanelProps {
  recipes: Recipe[];
  onDebug: () => void;
}

export function CuisineDebugPanel({ recipes, onDebug }: CuisineDebugPanelProps) {
  return (
    <div className="mb-4 space-y-4">
      <Button 
        variant="outline" 
        onClick={onDebug}
        className="w-full"
      >
        Debug Cuisine Data
      </Button>

      <ScrollArea className="h-[200px] border rounded-md p-4">
        <div className="space-y-2">
          <h3 className="font-medium">Raw Cuisine Values from Firebase:</h3>
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="text-sm">
              <span className="font-medium">{recipe.title}</span>: {recipe.cuisine || 'No cuisine set'}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}