import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BentoRecipeImport } from "./bento/BentoRecipeImport";
import { bentoBoxes } from "./bento/BentoBoxConfig";
import { BentoGridItem } from "./bento/BentoGridItem";
import { BentoModals } from "./bento/BentoModals";

interface BentoGridContentProps {
  recipes: Recipe[];
  generatedRecipes: Recipe[];
  user: any;
  selectedMethod: string | null;
  onAuthModalOpen?: () => void;
}

export function BentoGridContent({ 
  recipes, 
  generatedRecipes, 
  user,
  selectedMethod,
  onAuthModalOpen 
}: BentoGridContentProps) {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);
  const [localGeneratedRecipes, setLocalGeneratedRecipes] = useState<Recipe[]>([]);
  const PREVIEW_COUNT = 6;

  const handleAuthRequired = (action: () => void) => {
    if (!user) {
      if (onAuthModalOpen) {
        onAuthModalOpen();
      } else {
        setShowAuthModal(true);
      }
      return;
    }
    action();
  };

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("New recipes found:", newRecipes.length);
    setLocalGeneratedRecipes(newRecipes);
  };

  const handleBentoBoxClick = (actionType: string) => {
    switch (actionType) {
      case 'events':
        handleAuthRequired(() => navigate('/events'));
        break;
      case 'todo':
        handleAuthRequired(() => navigate('/todo'));
        break;
      case 'kitchen':
        handleAuthRequired(() => setShowKitchenModal(true));
        break;
      case 'cuisine':
        handleAuthRequired(() => setShowCuisineMap(true));
        break;
      case 'photo':
        handleAuthRequired(() => setShowImageRecognition(true));
        break;
      case 'url':
        handleAuthRequired(() => setShowUrlDialog(true));
        break;
      case 'clipboard':
        handleAuthRequired(() => setShowClipboardDialog(true));
        break;
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
    items.push(...bentoBoxes);
    items.push({ isSpecial: true, type: 'seasonal' });
    items.push({ isSpecial: true, type: 'quiz' });
    items.push(...recipes, ...generatedRecipes, ...localGeneratedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative",
        shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:via-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
      )}>
        {displayItems.map((item, index) => (
          <BentoGridItem
            key={index}
            box={item}
            onClick={() => handleBentoBoxClick(item.action)}
          />
        ))}
      </div>

      <BentoModals
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        showKitchenModal={showKitchenModal}
        setShowKitchenModal={setShowKitchenModal}
        showCuisineMap={showCuisineMap}
        setShowCuisineMap={setShowCuisineMap}
        showImageRecognition={showImageRecognition}
        setShowImageRecognition={setShowImageRecognition}
        showUrlDialog={showUrlDialog}
        setShowUrlDialog={setShowUrlDialog}
        showClipboardDialog={showClipboardDialog}
        setShowClipboardDialog={setShowClipboardDialog}
        recipes={recipes}
      />

      <BentoRecipeImport
        onRecipesFound={handleRecipesFound}
        recipes={recipes}
      />
    </div>
  );
}