import { Recipe } from "@/services/recipeService";
import { BentoGridItem } from "../BentoGridItem";
import { SeasonalRecipes } from "../SeasonalRecipes";
import { FlavorQuiz } from "../FlavorQuiz";

interface BentoGridRecipeItemProps {
  item: any;
  index: number;
  onRecipeClick: (id: string) => void;
}

export function BentoGridRecipeItem({ item, index, onRecipeClick }: BentoGridRecipeItemProps) {
  if (item.isSpecial) {
    if (item.type === 'seasonal') return <SeasonalRecipes key="seasonal" recipes={[]} />;
    if (item.type === 'quiz') return <FlavorQuiz key="quiz" />;
  }

  const recipe = item as Recipe;
  return (
    <BentoGridItem
      key={recipe.id}
      recipe={recipe}
      index={index}
      onRecipeClick={() => onRecipeClick(recipe.id)}
    />
  );
}