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
import { Plus, Camera, Globe, Filter } from "lucide-react";
import { ImageRecognitionDialog } from "../recipe/ImageRecognitionDialog";
import { AuthModal } from "../auth/AuthModal";
import { CookingMethodsSlider } from "./CookingMethodsSlider";
import { WeeklyStoriesSection } from "./WeeklyStoriesSection";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { RecipeFilter } from "../recipe/RecipeFilter";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const { user } = useAuth();
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pendingRecipes, setPendingRecipes] = useState<Partial<Recipe>[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const PREVIEW_COUNT = 6;
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
    navigate('/create-recipe', { 
      state: { 
        scannedRecipes,
        mode: 'photo'
      } 
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingRecipes.length > 0) {
      navigate('/create-recipe', { state: { scannedRecipes: pendingRecipes } });
      setPendingRecipes([]);
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
      title: "What's in your kitchen?",
      description: "Find recipes using ingredients you have",
      icon: Plus,
      action: () => navigate('/ingredients'),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    }
  ];

  const getGridItems = () => {
    const items = [];
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });
    items.push(...interactiveCards.map(card => ({ isInteractive: true, ...card, recipes: [...recipes, ...generatedRecipes] })));
    items.push(...recipes, ...generatedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 px-6">
        <CookingMethodsSlider 
          onMethodSelect={setSelectedMethod}
          selectedMethod={selectedMethod}
        />
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(true)}
          className="ml-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <WeeklyStoriesSection />
      
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
                recipes={[...recipes, ...generatedRecipes]}
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

      <CuisineMapDialog 
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={[...recipes, ...generatedRecipes]}
      />

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />

      <RecipeFilter
        open={showFilters}
        onOpenChange={setShowFilters}
        onFilterChange={() => {}}
      />
    </div>
  );
}
