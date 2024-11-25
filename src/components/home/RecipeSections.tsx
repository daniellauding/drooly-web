import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSwiper } from "@/components/RecipeSwiper";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeSectionsProps {
  isLoading: boolean;
  recipes: Recipe[];
}

export function RecipeSections({ isLoading, recipes }: RecipeSectionsProps) {
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

      <section>
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
                image={recipe.image}
                cookTime={recipe.cookTime}
                difficulty={recipe.difficulty}
                chef={recipe.chef}
                date={recipe.date}
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