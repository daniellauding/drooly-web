import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes = [], onAuthModalOpen }: BentoGridProps) {
  if (!recipes?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          {...recipe}
          onDismiss={onAuthModalOpen}
        />
      ))}
    </div>
  );
}