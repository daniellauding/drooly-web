import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="h-[400px] pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRecipe?.id === recipe.id 
                ? 'ring-2 ring-primary rounded-xl' 
                : 'hover:scale-[1.02]'
            }`}
            onClick={() => onSelectRecipe(recipe)}
          >
            <RecipeCard
              id={recipe.id}
              title={recipe.title}
              image={recipe.images?.[0]}
              cookTime={recipe.totalTime}
              difficulty={recipe.difficulty}
              chef={recipe.creatorName}
              stats={recipe.stats}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}