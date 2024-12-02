import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { BentoGridItem } from "./BentoGridItem";
import { BentoInteractiveCard } from "./BentoInteractiveCard";
import { SeasonalRecipes } from "./SeasonalRecipes";
import { FlavorQuiz } from "./FlavorQuiz";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridContentProps {
  recipes: Recipe[];
  generatedRecipes: Recipe[];
  user: any;
  onAuthModalOpen?: () => void;
  selectedMethod: string | null;
}

export function BentoGridContent({ 
  recipes, 
  generatedRecipes, 
  user, 
  onAuthModalOpen,
  selectedMethod 
}: BentoGridContentProps) {
  const navigate = useNavigate();
  const [localGeneratedRecipes, setLocalGeneratedRecipes] = useState<Recipe[]>([]);
  const PREVIEW_COUNT = 6;

  const interactiveCards = [
    {
      title: "Take Photo & Scan",
      description: "Create recipes from photos of your cookbooks",
      icon: "Camera",
      action: () => navigate('/create-recipe?mode=photo'),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "What's in your kitchen?",
      description: "Find recipes using ingredients you have",
      icon: "Plus",
      action: () => navigate('/ingredients'),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    }
  ];

  const filterRecipesByMethod = (items: (Recipe | any)[]) => {
    if (!selectedMethod) return items;
    return items.filter((item) => {
      if ('cookingMethods' in item) {
        return item.cookingMethods?.includes(selectedMethod);
      }
      return true;
    });
  };

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("New recipes found:", newRecipes.length);
    setLocalGeneratedRecipes(newRecipes);
  };

  const getGridItems = () => {
    const items = [];
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });
    items.push(...interactiveCards.map(card => ({ isInteractive: true, ...card })));
    items.push(...recipes, ...generatedRecipes, ...localGeneratedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  const renderGridItem = (item: any, index: number) => {
    if (item.isSpecial) {
      if (item.type === 'seasonal') {
        return <SeasonalRecipes key="seasonal" recipes={recipes} />;
      }
      if (item.type === 'quiz') {
        return <FlavorQuiz key="quiz" />;
      }
    }

    if ('isInteractive' in item) {
      return (
        <BentoInteractiveCard
          key={`interactive-${index}`}
          item={item}
          onRecipesFound={handleRecipesFound}
          recipes={[...recipes, ...generatedRecipes, ...localGeneratedRecipes]}
        />
      );
    }

    const recipe = item as Recipe;
    return (
      <BentoGridItem
        key={recipe.id}
        recipe={recipe}
        index={index}
        onRecipeClick={() => navigate(`/recipe/${recipe.id}`)}
      />
    );
  };

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6",
      shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
    )}>
      {displayItems.map((item, index) => renderGridItem(item, index))}

      {shouldShowOverlay && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-[2px] z-10">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Wanna see more?</h2>
          <Button 
            size="lg"
            onClick={onAuthModalOpen}
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            Login or create account
          </Button>
        </div>
      )}
    </div>
  );
}