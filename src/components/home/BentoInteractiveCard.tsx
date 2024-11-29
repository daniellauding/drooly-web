import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { IngredientSearchModal } from "../ingredients/IngredientSearchModal";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/components/ui/use-toast";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GeneratedRecipes } from "../recipe/GeneratedRecipes";

interface BentoInteractiveCardProps {
  item: {
    title: string;
    description: string;
    icon: LucideIcon;
    action: () => void;
    color: string;
    textColor: string;
  };
  onRecipesFound?: (recipes: Recipe[]) => void;
}

export function BentoInteractiveCard({ item, onRecipesFound }: BentoInteractiveCardProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  const handleClick = () => {
    if (item.title === "What's in your kitchen?") {
      setIsSearchOpen(true);
    } else {
      item.action();
    }
  };

  const handleIngredientSelection = async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to find recipes",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Generating recipes for ingredients:", ingredients);
      const recipes = await generateDetailedRecipes(ingredients);
      console.log("Generated recipes:", recipes);
      
      if (recipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try selecting different ingredients",
          variant: "destructive"
        });
        return;
      }

      setGeneratedRecipes(recipes);
      if (onRecipesFound) {
        onRecipesFound(recipes);
      }
      
      setIsSearchOpen(false);
      setIsResultsOpen(true);
      
      toast({
        title: "Recipes found!",
        description: `Found ${recipes.length} recipes using your ingredients`,
      });
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResults = () => {
    setIsResultsOpen(false);
    setGeneratedRecipes([]);
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg min-h-[300px]",
          item.color
        )}
        onClick={handleClick}
      >
        <div className="p-8 h-full flex items-center">
          <div className="flex items-center gap-6">
            <div className={cn("p-4 rounded-full bg-white/80", item.textColor)}>
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className={cn("text-xl font-semibold mb-2", item.textColor)}>
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <IngredientSearchModal
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onRecipesGenerated={handleIngredientSelection}
        isLoading={isLoading}
      />

      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="max-w-7xl">
          <GeneratedRecipes 
            recipes={generatedRecipes} 
            onClose={handleCloseResults}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}