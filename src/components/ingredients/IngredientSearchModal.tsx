import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "../RecipeCard";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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
      await onRecipesGenerated(selectedIngredients);
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

  const handleRecipeClick = (recipeId: string) => {
    console.log('Navigating to recipe:', recipeId);
    onOpenChange(false); // Close the modal before navigation
    navigate(`/recipe/${recipeId}`);
  };

  const handleRegenerateRecipes = async () => {
    await handleGenerateRecipes();
    toast({
      title: "Generating new recipes",
      description: "Finding new recipe combinations with your ingredients..."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateRecipes} 
              className="flex-1"
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
            {generatedRecipes.length > 0 && (
              <Button
                variant="outline"
                onClick={handleRegenerateRecipes}
                disabled={isGenerating || isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New
              </Button>
            )}
          </div>

          {generatedRecipes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Generated Recipes:</h3>
              <div className="grid gap-4">
                {generatedRecipes.map((recipe) => (
                  <div 
                    key={recipe.id}
                    className="cursor-pointer"
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      images={recipe.images}
                      cookTime={recipe.totalTime}
                      difficulty={recipe.difficulty}
                      chef="AI Generated"
                      date={new Date().toLocaleDateString()}
                      stats={recipe.stats}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}