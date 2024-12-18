import { Recipe } from "@/types/recipe";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Apple, Search, Plus, Utensils, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";
import { Button } from "@/components/ui/button";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { CuisineMapDialog } from "./CuisineMapDialog";

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: any;
  action: () => void;
  color: string;
  textColor: string;
  recipes?: Recipe[]; // Add recipes prop
}

export function BentoInteractiveCard({ 
  item,
  onRecipesFound,
  recipes // Add recipes parameter
}: { 
  item: InteractiveCardProps;
  onRecipesFound: (recipes: Recipe[]) => void;
  recipes?: Recipe[]; // Add recipes type
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const Icon = item.icon;

  const handleGenerateRecipes = async (ingredients: string[]) => {
    console.log("Generating recipes for ingredients:", ingredients);
    setIsGenerating(true);
    try {
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

      onRecipesFound(recipes);
      setIsModalOpen(false);

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
      setIsGenerating(false);
    }
  };

  const handleCardClick = () => {
    console.log("BentoInteractiveCard - Card clicked:", item.title);
    if (item.title === "What's in your kitchen?") {
      setIsModalOpen(true);
    } else if (item.title === "Explore Cuisines") {
      console.log("BentoInteractiveCard - Opening cuisine map with recipes:", recipes);
      setIsMapOpen(true);
    } else {
      item.action();
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg min-h-[350px] flex flex-col items-center justify-center p-8 text-center gap-4",
          item.color,
          isGenerating && "pointer-events-none opacity-70"
        )}
        onClick={handleCardClick}
      >
        <div className={cn("p-4 rounded-full", item.color)}>
          {isGenerating ? (
            <Loader2 className={cn("w-8 h-8 animate-spin", item.textColor)} />
          ) : (
            <Icon className={cn("w-8 h-8", item.textColor)} />
          )}
        </div>
        <h3 className={cn("text-xl font-semibold", item.textColor)}>
          {isGenerating ? "Generating Recipes..." : item.title}
        </h3>
        <p className={cn("text-sm", item.textColor)}>
          {isGenerating ? "Please wait while we find recipes for you" : item.description}
        </p>
      </Card>

      <IngredientSearchModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRecipesGenerated={handleGenerateRecipes}
        isLoading={isGenerating}
      />

      <CuisineMapDialog
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        recipes={recipes || []} // Pass the recipes prop
      />
    </>
  );
}