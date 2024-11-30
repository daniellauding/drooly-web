import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { useToast } from "@/hooks/use-toast";
import { Recipe } from "@/types/recipe";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RecipeCardStack } from "./RecipeCardStack";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";

interface IngredientSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipesGenerated: (ingredients: string[]) => void;
  isLoading?: boolean;
}

export function IngredientSearchModal({ 
  open, 
  onOpenChange,
  onRecipesGenerated,
  isLoading = false
}: IngredientSearchModalProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const { toast } = useToast();

  const handleIngredientSelect = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to generate recipes.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recipes = await generateDetailedRecipes(selectedIngredients);
      setGeneratedRecipes(recipes);
      onRecipesGenerated(selectedIngredients);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCloseAttempt = () => {
    if (generatedRecipes.length > 0) {
      setShowCloseAlert(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    console.log('Saving recipe:', recipe.id);
    // Add save logic here
    toast({
      title: "Recipe saved",
      description: "Added to your saved recipes"
    });
  };

  const handleDismissRecipe = (recipe: Recipe) => {
    console.log('Dismissing recipe:', recipe.id);
    toast({
      title: "Recipe dismissed",
      description: "You won't see this recipe again"
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>What's in your kitchen?</DialogTitle>
          </DialogHeader>

          {generatedRecipes.length === 0 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Ingredients:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map(ingredient => (
                    <Button
                      key={ingredient}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveIngredient(ingredient)}
                    >
                      {ingredient} ×
                    </Button>
                  ))}
                </div>
              </div>

              <IngredientSuggestions
                onSelect={handleIngredientSelect}
                onClose={() => {}}
              />

              <Button 
                onClick={handleGenerateRecipes}
                disabled={isLoading || selectedIngredients.length === 0}
                className="w-full"
              >
                Find Recipes
              </Button>
            </div>
          ) : (
            <RecipeCardStack
              recipes={generatedRecipes}
              onRegenerate={handleGenerateRecipes}
              onSave={handleSaveRecipe}
              onDismiss={handleDismissRecipe}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You still have recipes to review. Are you sure you want to close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}