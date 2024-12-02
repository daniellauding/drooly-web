import { Button } from "@/components/ui/button";
import { CookingMethodsSlider } from "./CookingMethodsSlider";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { AuthModal } from "@/components/auth/AuthModal";

interface BentoGridHeaderProps {
  onMethodSelect: (method: string | null) => void;
  selectedMethod: string | null;
  onShowFilters: () => void;
}

export function BentoGridHeader({ 
  onMethodSelect, 
  selectedMethod,
  onShowFilters 
}: BentoGridHeaderProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);

  const handleAction = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const quickActions = [
    {
      label: "What's in your kitchen?",
      onClick: () => handleAction(() => setShowKitchenModal(true))
    },
    {
      label: "Explore cuisines",
      onClick: () => handleAction(() => setShowCuisineMap(true))
    },
    {
      label: "Import from URL",
      onClick: () => handleAction(() => setShowUrlDialog(true))
    },
    {
      label: "Paste from clipboard",
      onClick: () => handleAction(() => setShowClipboardDialog(true))
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={action.onClick}
            className="text-sm"
          >
            {action.label}
          </Button>
        ))}
      </div>

      <CookingMethodsSlider 
        onMethodSelect={onMethodSelect}
        selectedMethod={selectedMethod}
      />

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />

      <IngredientSearchModal
        open={showKitchenModal}
        onOpenChange={setShowKitchenModal}
        onRecipesGenerated={() => {}}
        isLoading={false}
      />

      <CuisineMapDialog
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={[]}
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
    </div>
  );
}