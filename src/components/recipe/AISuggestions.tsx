import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AISuggestionsProps {
  onSuggestionsApply: (suggestions: Partial<Recipe>) => void;
  currentRecipe: Partial<Recipe>;
}

export function AISuggestions({ onSuggestionsApply, currentRecipe }: AISuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Partial<Recipe> | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    console.log("Generating AI suggestions for recipe:", currentRecipe);
    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual AI API call
      // This is a mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions: Partial<Recipe> = {
        title: currentRecipe.title || "Delicious Home-Style Pasta",
        description: "A comforting pasta dish that combines traditional Italian flavors with modern cooking techniques.",
        cuisine: "Italian",
        difficulty: "Medium",
        categories: ["Family Friendly", "Comfort Food"],
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false,
          containsNuts: false
        },
        season: "Year Round",
        occasion: "Family Dinner",
        equipment: ["Pot", "Pan", "Colander"],
        cookingMethods: ["Boiling", "Sautéing"],
        dishTypes: ["Main Course"],
        servings: {
          amount: 4,
          unit: "serving"
        },
        totalTime: "30 min"
      };

      setSuggestions(mockSuggestions);
      console.log("Generated suggestions:", mockSuggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate suggestions. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestions = () => {
    if (suggestions) {
      console.log("Applying suggestions:", suggestions);
      onSuggestionsApply(suggestions);
      toast({
        title: "Suggestions Applied",
        description: "AI suggestions have been applied to your recipe."
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 className="h-4 w-4" />
          Get AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Recipe Suggestions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!suggestions ? (
            <Button 
              onClick={generateSuggestions} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating Suggestions..." : "Generate Suggestions"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Suggested Recipe Details:</h3>
                <div className="rounded-lg border p-4 space-y-2">
                  <p><strong>Title:</strong> {suggestions.title}</p>
                  <p><strong>Description:</strong> {suggestions.description}</p>
                  <p><strong>Cuisine:</strong> {suggestions.cuisine}</p>
                  <p><strong>Difficulty:</strong> {suggestions.difficulty}</p>
                  <p><strong>Categories:</strong> {suggestions.categories?.join(", ")}</p>
                  <p><strong>Season:</strong> {suggestions.season}</p>
                  <p><strong>Occasion:</strong> {suggestions.occasion}</p>
                  <p><strong>Equipment:</strong> {suggestions.equipment?.join(", ")}</p>
                  <p><strong>Cooking Methods:</strong> {suggestions.cookingMethods?.join(", ")}</p>
                  <p><strong>Dish Type:</strong> {suggestions.dishTypes?.join(", ")}</p>
                  <p><strong>Servings:</strong> {suggestions.servings?.amount} {suggestions.servings?.unit}</p>
                  <p><strong>Total Time:</strong> {suggestions.totalTime}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleApplySuggestions}
                className="w-full"
              >
                Apply Suggestions
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}