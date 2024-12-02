import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { useAuth } from "@/contexts/AuthContext";
import { ImageRecognitionDialog } from "../recipe/ImageRecognitionDialog";
import { AuthModal } from "../auth/AuthModal";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { RecipeFilter } from "../recipe/RecipeFilter";
import { BentoGridHeader } from "./BentoGridHeader";
import { BentoGridItem } from "./bento/BentoGridItem";
import { bentoBoxes } from "./bento/BentoBoxConfig";
import { BentoModals } from "./bento/BentoModals";
import { cn } from "@/lib/utils";

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
  console.log('BentoGridContent rendering with recipes:', recipes.length);
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

  const handleBentoBoxClick = (actionType: string) => {
    console.log('Bento box clicked:', actionType);
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

  const handleRecipeClick = (id: string) => {
    console.log('Recipe clicked:', id);
    navigate(`/recipe/${id}`);
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
    items.push(...recipes, ...generatedRecipes, ...localGeneratedRecipes);
    return filterRecipesByMethod(items);
  };

  const gridItems = getGridItems();
  console.log('Grid items prepared:', gridItems.length);
  const shouldShowOverlay = !user && gridItems.length > PREVIEW_COUNT;
  const displayItems = user ? gridItems : gridItems.slice(0, PREVIEW_COUNT);

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative",
        shouldShowOverlay && "after:absolute after:inset-0 after:from-transparent after:via-transparent after:to-white after:bg-gradient-to-b after:h-full after:pointer-events-none"
      )}>
        {displayItems.map((item, index) => {
          console.log('Rendering item:', item);
          return (
            <BentoGridItem
              key={index}
              box={item}
              onClick={() => 'id' in item ? handleRecipeClick(item.id) : handleBentoBoxClick(item.action)}
            />
          );
        })}
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
    </div>
  );
}