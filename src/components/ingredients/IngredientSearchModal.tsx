import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { Recipe } from "@/types/recipe";
import { generateRecipesByIngredients } from "@/services/openaiService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface IngredientSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipesGenerated: (recipes: Recipe[]) => void;
}

export function IngredientSearchModal({ 
  open, 
  onOpenChange,
  onRecipesGenerated 
}: IngredientSearchModalProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
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
      const recipes = await generateRecipesByIngredients(selectedIngredients);
      onRecipesGenerated(recipes);
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            disabled={isGenerating}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating Recipes..." : "Find Recipes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}