import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { BentoGridRecipeItem } from "./bento/BentoGridRecipeItem";
import { BentoGridOverlay } from "./bento/BentoGridOverlay";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ChefHat, CalendarDays, ListTodo, Globe, Camera, Link, ClipboardPaste } from "lucide-react";

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

  const handleAuthRequired = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("New recipes found:", newRecipes.length);
    setLocalGeneratedRecipes(newRecipes);
  };

  // Handle single recipe additions from URL and Clipboard imports
  const handleSingleRecipeFound = (recipe: Partial<Recipe>) => {
    if (recipe) {
      setLocalGeneratedRecipes(prev => [...prev, recipe as Recipe]);
    }
  };

  // Handle ingredients-based recipe generation
  const handleIngredientsBasedRecipes = async (ingredients: string[]) => {
    // This function will be passed to IngredientSearchModal
    console.log("Handling ingredients:", ingredients);
    // The actual recipe generation happens in the IngredientSearchModal component
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
    },
    {
      title: "Explore Cuisines",
      description: "Discover recipes from around the world",
      icon: Globe,
      action: () => handleAuthRequired(() => setShowCuisineMap(true)),
      color: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      title: "Take Photo & Scan",
      description: "Import recipes from photos",
      icon: Camera,
      action: () => handleAuthRequired(() => setShowImageRecognition(true)),
      color: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      textColor: "text-pink-700"
    },
    {
      title: "Import from URL",
      description: "Convert any recipe to your collection",
      icon: Link,
      action: () => handleAuthRequired(() => setShowUrlDialog(true)),
      color: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      textColor: "text-indigo-700"
    },
    {
      title: "Paste from Clipboard",
      description: "Import recipes from your clipboard",
      icon: ClipboardPaste,
      action: () => handleAuthRequired(() => setShowClipboardDialog(true)),
      color: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      textColor: "text-teal-700"
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
    items.push(...bentoBoxes.map(box => ({ ...box, isBentoBox: true })));
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });
    items.push(...recipes, ...generatedRecipes, ...localGeneratedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  const renderGridItem = (item: any, index: number) => {
    if (item.isBentoBox) {
      return (
        <Card
          key={index}
          className={cn(
            "p-6 cursor-pointer transition-all duration-200",
            item.color,
            item.hoverColor
          )}
          onClick={item.action}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <item.icon className={cn("w-8 h-8", item.textColor)} />
            <div>
              <h3 className={cn("font-semibold mb-2", item.textColor)}>
                {item.title}
              </h3>
              <p className={cn("text-sm", item.textColor)}>
                {item.description}
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <BentoGridRecipeItem
        key={index}
        item={item}
        index={index}
        onRecipeClick={(id) => navigate(`/recipe/${id}`)}
      />
    );
  };

  return (
    <div className="space-y-6">
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
        onRecipeScanned={handleRecipesFound}
      />

      <RecipeUrlDialog
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
        onRecipeScraped={handleSingleRecipeFound}
      />

      <ClipboardImportDialog
        open={showClipboardDialog}
        onOpenChange={setShowClipboardDialog}
        onRecipeImported={handleSingleRecipeFound}
      />

      <CuisineMapDialog
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={recipes}
      />

      <IngredientSearchModal
        open={showKitchenModal}
        onOpenChange={setShowKitchenModal}
        onRecipesGenerated={handleIngredientsBasedRecipes}
        isLoading={false}
      />
    </div>
  );
}