import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { CuisineMapDialog } from "../CuisineMapDialog";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";

interface BentoRecipeImportProps {
  onRecipesFound: (recipes: Recipe[]) => void;
  recipes: Recipe[];
}

export function BentoRecipeImport({ onRecipesFound, recipes }: BentoRecipeImportProps) {
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);

  const handleSingleRecipeFound = (recipe: Partial<Recipe>) => {
    if (recipe) {
      onRecipesFound([recipe as Recipe]);
    }
  };

  const handleIngredientsBasedRecipes = async (ingredients: string[]) => {
    console.log("Handling ingredients:", ingredients);
  };

  return (
    <>
      <ImageRecognitionDialog
        open={showImageRecognition}
        onOpenChange={setShowImageRecognition}
        onRecipeScanned={onRecipesFound}
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
    </>
  );
}