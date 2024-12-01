import { useEffect, useState } from "react";
import { Recipe } from "@/services/recipeService";
import { Button } from "@/components/ui/button";
import { BentoGridItem } from "./BentoGridItem";
import { BentoInteractiveCard } from "./BentoInteractiveCard";
import { SeasonalRecipes } from "./SeasonalRecipes";
import { FlavorQuiz } from "./FlavorQuiz";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Plus, Camera } from "lucide-react";
import { ImageRecognitionDialog } from "../recipe/ImageRecognitionDialog";
import { AuthModal } from "../auth/AuthModal";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const { user } = useAuth();
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRecipes, setPendingRecipes] = useState<Partial<Recipe>[]>([]);
  const PREVIEW_COUNT = 8;
  const navigate = useNavigate();
  
  console.log('BentoGrid received recipes count:', recipes.length);

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("Received AI generated recipes:", newRecipes);
    setGeneratedRecipes(newRecipes);
  };

  const handleScanRecipes = (scannedRecipes: Partial<Recipe>[]) => {
    console.log("Recipes scanned:", scannedRecipes.length);
    if (!user) {
      setPendingRecipes(scannedRecipes);
      setShowAuthModal(true);
      return;
    }
    navigate('/create-recipe', { state: { scannedRecipes } });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingRecipes.length > 0) {
      navigate('/create-recipe', { state: { scannedRecipes: pendingRecipes } });
      setPendingRecipes([]);
    }
  };

  const interactiveCards = [
    {
      title: "Take Photo & Scan",
      description: "Create recipes from photos of your cookbooks",
      icon: Camera,
      action: () => setShowImageRecognition(true),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "Explore Cuisines",
      description: "Discover recipes from around the world",
      icon: Plus,
      action: () => navigate('/create-recipe?mode=cuisine'),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Quick Search",
      description: "Find exactly what you're looking for",
      icon: Plus,
      action: () => navigate('/create-recipe?mode=search'),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    }
  ];

  const getGridItems = () => {
    const items = [];
    let interactiveIndex = 0;

    // Add seasonal recipes and quiz at the beginning
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });

    // Add all recipes
    items.push(...recipes, ...generatedRecipes);
    
    // Add interactive cards every 6 recipes
    for (let i = 0; i < items.length; i += 6) {
      if (interactiveIndex < interactiveCards.length) {
        items.splice(i + 2, 0, {
          isInteractive: true,
          ...interactiveCards[interactiveIndex]
        });
        interactiveIndex++;
      }
    }

    // Add create recipe card for non-logged in users
    if (!user) {
      items.splice(2, 0, {
        isInteractive: true,
        title: "Create Your Own",
        description: "Login or register to start sharing recipes",
        icon: Plus,
        action: onAuthModalOpen,
        color: "bg-green-50 hover:bg-green-100",
        textColor: "text-green-700"
      });
    }

    return items;
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  return (
    <div className="relative">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6",
        shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
      )}>
        {displayItems.map((item, index) => {
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
        })}
      </div>

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

      <ImageRecognitionDialog
        open={showImageRecognition}
        onOpenChange={setShowImageRecognition}
        onRecipeScanned={handleScanRecipes}
      />

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />
    </div>
  );
}
