import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";

interface ProfileRecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  emptyMessage: string;
}

export function ProfileRecipeGrid({ recipes, isLoading, emptyMessage }: ProfileRecipeGridProps) {
  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={`recipe-${recipe.id}`}
          id={recipe.id}
          title={recipe.title}
          image={recipe.images?.[recipe.featuredImageIndex || 0]}
          cookTime={recipe.totalTime}
          difficulty={recipe.difficulty}
          chef={recipe.creatorName}
          date={new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}
          stats={recipe.stats}
          creatorId={recipe.creatorId}
        />
      ))}
    </div>
  );
}