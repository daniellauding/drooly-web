import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { BentoGridItem } from "./BentoGridItem";
import { SeasonalRecipes } from "./SeasonalRecipes";
import { FlavorQuiz } from "./FlavorQuiz";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { BentoGridOverlay } from "./bento/BentoGridOverlay";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ChefHat, CalendarDays, ListTodo } from "lucide-react";

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
  selectedMethod 
}: BentoGridContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [localGeneratedRecipes, setLocalGeneratedRecipes] = useState<Recipe[]>([]);
  const PREVIEW_COUNT = 6;

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("New recipes found:", newRecipes.length);
    setLocalGeneratedRecipes(newRecipes);
  };

  const handleAuthRequired = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const bentoBoxes = [
    {
      title: "What's in your kitchen?",
      description: "Find recipes using ingredients you have",
      icon: ChefHat,
      action: () => handleAuthRequired(() => setShowKitchenModal(true)),
      color: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "Plan an Event",
      description: "Organize food events with friends and family",
      icon: CalendarDays,
      action: () => handleAuthRequired(() => navigate('/events')),
      color: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "My Planning",
      description: "Manage your shopping list and meal plans",
      icon: ListTodo,
      action: () => handleAuthRequired(() => navigate('/todo')),
      color: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      textColor: "text-green-700"
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

  const getGridItems = () => {
    const items = [];
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });
    items.push(...recipes, ...generatedRecipes, ...localGeneratedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  const renderBentoBoxes = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {bentoBoxes.map((box, index) => (
        <Card
          key={index}
          className={cn(
            "p-6 cursor-pointer transition-all duration-200",
            box.color,
            box.hoverColor
          )}
          onClick={box.action}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <box.icon className={cn("w-8 h-8", box.textColor)} />
            <div>
              <h3 className={cn("font-semibold mb-2", box.textColor)}>
                {box.title}
              </h3>
              <p className={cn("text-sm", box.textColor)}>
                {box.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderGridItem = (item: any, index: number) => {
    if (item.isSpecial) {
      if (item.type === 'seasonal') return <SeasonalRecipes key="seasonal" recipes={recipes} />;
      if (item.type === 'quiz') return <FlavorQuiz key="quiz" />;
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
    <div className="space-y-6">
      {renderBentoBoxes()}
      
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative",
        shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:via-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
      )}>
        {displayItems.map((item, index) => renderGridItem(item, index))}
        <BentoGridOverlay 
          visible={shouldShowOverlay} 
          onLoginClick={() => setShowAuthModal(true)} 
        />
      </div>

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
        onRecipesGenerated={handleRecipesFound}
        isLoading={false}
      />
    </div>
  );
}