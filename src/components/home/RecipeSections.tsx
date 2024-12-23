import { Recipe } from "@/services/recipeService";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSwiper } from "@/components/RecipeSwiper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RecipeSectionsProps {
  isLoading: boolean;
  error?: Error | null;
  recipes: Recipe[];
}

export function RecipeSections({ isLoading, error, recipes }: RecipeSectionsProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load recipes. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const popularRecipes = recipes?.slice(0, 3) || [];

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-6">Discover New Recipes</h2>
        {isLoading ? (
          <div className="w-full max-w-md mx-auto h-[400px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : recipes.length > 0 ? (
          <RecipeSwiper recipes={recipes} />
        ) : (
          <p className="text-center text-gray-500">No recipes available yet.</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popular Recipes</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        ) : popularRecipes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                images={recipe.images}
                cookTime={recipe.cookTime}
                difficulty={recipe.difficulty}
                chef={recipe.chef}
                date={recipe.date}
                stats={recipe.stats}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No popular recipes available yet.</p>
        )}
      </section>
    </>
  );
}