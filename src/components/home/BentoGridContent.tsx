import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { BentoGridItem } from "./BentoGridItem";
import { BentoInteractiveCard } from "./BentoInteractiveCard";
import { SeasonalRecipes } from "./SeasonalRecipes";
import { FlavorQuiz } from "./FlavorQuiz";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const PREVIEW_COUNT = 6;

  const interactiveCards = [
    {
      title: "Take Photo & Scan",
      description: "Create recipes from photos of your cookbooks",
      icon: "Camera",
      action: () => setShowImageRecognition(true),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "What's in your kitchen?",
      description: "Find recipes using ingredients you have",
      icon: "Plus",
      action: () => setShowKitchenModal(true),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    }
  ];

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("New recipes found:", newRecipes.length);
    setLocalGeneratedRecipes(newRecipes);
  };

  const handleGenerateRecipes = async (ingredients: string[]) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }
      
      const generatedRecipes = await response.json();
      setLocalGeneratedRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filterRecipesByMethod = (items: (Recipe | any)[]) => {
    if (!selectedMethod) return items;
    return items.filter((item) => {
      if ('cookingMethods' in item) {
        return item.cookingMethods?.includes(selectedMethod);
      }
      return true;
    });
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
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative",
      shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:via-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
    )}>
      {displayItems.map((item, index) => renderGridItem(item, index))}

      {shouldShowOverlay && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 bg-black/5 backdrop-blur-[2px] z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Want to see more?</h2>
            <Button 
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              Login or create account
            </Button>
          </div>
        </div>
      )}

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />

      <ImageRecognitionDialog
        open={showImageRecognition}
        onOpenChange={setShowImageRecognition}
        onRecipeScanned={() => {}}
      />

      <RecipeUrlDialog
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
        onRecipeScraped={() => {}}
      />

      <ClipboardImportDialog
        open={showClipboardDialog}
        onOpenChange={setShowClipboardDialog}
        onRecipeImported={() => {}}
      />

      <CuisineMapDialog
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={recipes}
      />

      <IngredientSearchModal
        open={showKitchenModal}
        onOpenChange={setShowKitchenModal}
        onRecipesGenerated={handleGenerateRecipes}
        isLoading={isGenerating}
      />
    </div>
  );
}