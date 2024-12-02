import { AuthModal } from "@/components/auth/AuthModal";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { CuisineMapDialog } from "../CuisineMapDialog";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { Recipe } from "@/services/recipeService";

interface BentoModalsProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showKitchenModal: boolean;
  setShowKitchenModal: (show: boolean) => void;
  showCuisineMap: boolean;
  setShowCuisineMap: (show: boolean) => void;
  showImageRecognition: boolean;
  setShowImageRecognition: (show: boolean) => void;
  showUrlDialog: boolean;
  setShowUrlDialog: (show: boolean) => void;
  showClipboardDialog: boolean;
  setShowClipboardDialog: (show: boolean) => void;
  recipes: Recipe[];
}

export function BentoModals({
  showAuthModal,
  setShowAuthModal,
  showKitchenModal,
  setShowKitchenModal,
  showCuisineMap,
  setShowCuisineMap,
  showImageRecognition,
  setShowImageRecognition,
  showUrlDialog,
  setShowUrlDialog,
  showClipboardDialog,
  setShowClipboardDialog,
  recipes,
}: BentoModalsProps) {
  return (
    <>
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
        recipes={recipes}
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
    </>
  );
}