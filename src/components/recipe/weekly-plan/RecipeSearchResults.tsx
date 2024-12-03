import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipe";
import { Checkbox } from "@/components/ui/checkbox";

interface RecipeSearchResultsProps {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onSelectRecipe: (recipe: Recipe) => void;
}

export function RecipeSearchResults({
  recipes,
  selectedRecipe,
  onSelectRecipe
}: RecipeSearchResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className={`p-4 cursor-pointer hover:bg-accent ${
            selectedRecipe?.id === recipe.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={(e) => {
            e.preventDefault();
            onSelectRecipe(recipe);
          }}
        >
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedRecipe?.id === recipe.id}
              onCheckedChange={() => onSelectRecipe(recipe)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {recipe.images?.[0] && (
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {recipe.description?.slice(0, 100)}
                    {recipe.description?.length > 100 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}