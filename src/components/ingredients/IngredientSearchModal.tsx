import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";
import { AIRecipeSwiper } from "../recipe/ai/AIRecipeSwiper";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
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

    setIsGenerating(true);
    try {
      console.log("Generating recipes for ingredients:", selectedIngredients);
      onRecipesGenerated(selectedIngredients);
      
      toast({
        title: "Finding recipes...",
        description: `Searching for recipes using your ingredients`,
      });
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseAttempt = (open: boolean) => {
    if (!open && isGenerating) {
      setShowConfirmClose(true);
      return;
    }
    onOpenChange(open);
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>What's in your kitchen?</DialogTitle>
          </DialogHeader>

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
              className="w-full"
              disabled={isGenerating || isLoading}
            >
              {isGenerating || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Recipes...
                </>
              ) : (
                "Find Recipes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Recipes are still being generated. If you close now, the process will be cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Generating</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Yes, Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}