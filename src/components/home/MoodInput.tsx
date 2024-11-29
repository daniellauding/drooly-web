import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Cookie, UtensilsCrossed, Pizza, Beer, Sandwich, Soup, Apple } from "lucide-react";
import { IngredientSuggestions } from "../ingredients/IngredientSuggestions";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";
import { useToast } from "@/hooks/use-toast";
import { Recipe } from "@/types/recipe";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";

type Mood = {
  icon: React.ElementType;
  label: string;
  filterCategory?: string;
};

const moods: Mood[] = [
  { icon: Coffee, label: "Breakfast", filterCategory: "breakfast" },
  { icon: Sandwich, label: "Lunch", filterCategory: "lunch" },
  { icon: UtensilsCrossed, label: "Dinner", filterCategory: "dinner" },
  { icon: Cookie, label: "Snack", filterCategory: "snacks" },
  { icon: Pizza, label: "Craving", filterCategory: "comfort-food" },
  { icon: Beer, label: "Party Food", filterCategory: "party" },
  { icon: Soup, label: "Comfort Food", filterCategory: "comfort-food" },
  { icon: Apple, label: "What's in your kitchen?", filterCategory: "ingredients" },
];

interface MoodInputProps {
  onFilterChange?: (category: string) => void;
}

export function MoodInput({ onFilterChange }: MoodInputProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [customMood, setCustomMood] = useState("");
  const [isKitchenModalOpen, setIsKitchenModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = async (mood: Mood) => {
    if (mood.label === "What's in your kitchen?") {
      setIsKitchenModalOpen(true);
      setOpen(false);
      return;
    }

    if (mood.filterCategory && onFilterChange) {
      onFilterChange(mood.filterCategory);
    }
    setOpen(false);
  };

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

      if (onFilterChange) {
        onFilterChange(`ingredients:${ingredients.join(',')}`);
      }
      
      toast({
        title: "Recipes found!",
        description: `Found ${recipes.length} recipes using your ingredients`,
      });
      
      setIsKitchenModalOpen(false);
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

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 h-12 justify-start px-4 text-muted-foreground hover:text-foreground"
          >
            <img 
              src={user.photoURL || "/placeholder.svg"} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
            <span className="truncate">What are you craving today, {user.displayName?.split(' ')[0] || 'there'}?</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            {moods.map((mood) => (
              <Button
                key={mood.label}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-accent"
                onClick={() => handleMoodSelect(mood)}
                disabled={isGenerating}
              >
                <mood.icon className="h-6 w-6" />
                <span className="text-sm">{mood.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-4 pb-4">
            <Input
              placeholder="Or type something else..."
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                if (customMood.trim()) {
                  if (onFilterChange) onFilterChange(customMood.toLowerCase());
                  setOpen(false);
                }
              }}
              disabled={!customMood.trim()}
            >
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <IngredientSearchModal
        open={isKitchenModalOpen}
        onOpenChange={setIsKitchenModalOpen}
        onRecipesGenerated={handleGenerateRecipes}
        isLoading={isGenerating}
      />
    </>
  );
}