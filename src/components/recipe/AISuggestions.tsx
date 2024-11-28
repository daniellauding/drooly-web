import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ingredient } from "@/services/recipeService";

interface AISuggestionsProps {
  onSuggestionsApply: (suggestions: Partial<Recipe>) => void;
  currentRecipe: Partial<Recipe>;
}

export function AISuggestions({ onSuggestionsApply, currentRecipe }: AISuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Partial<Recipe> | null>(null);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const generateSuggestions = async () => {
    console.log("Generating AI suggestions for recipe:", currentRecipe);
    console.log("Using description:", description);
    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual AI API call
      // This is a mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions: Partial<Recipe> = {
        title: currentRecipe.title || "Mediterranean Pasta Primavera",
        description: description || "A vibrant and healthy pasta dish bursting with fresh vegetables and Mediterranean flavors.",
        images: [
          "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
        ],
        ingredients: [
          { name: "Whole Grain Pasta", amount: "16", unit: "oz", group: "Main Ingredients" },
          { name: "Cherry Tomatoes", amount: "2", unit: "cup", group: "Main Ingredients" },
          { name: "Zucchini", amount: "2", unit: "piece", group: "Main Ingredients" },
          { name: "Bell Peppers", amount: "2", unit: "piece", group: "Main Ingredients" },
          { name: "Olive Oil", amount: "1/4", unit: "cup", group: "Sauce" },
          { name: "Fresh Basil", amount: "1", unit: "cup", group: "Garnish" },
          { name: "Pine Nuts", amount: "1/4", unit: "cup", group: "Garnish" },
        ],
        cuisine: "Mediterranean",
        difficulty: "Medium",
        categories: ["Healthy", "Vegetarian", "Family Friendly", "Meal Prep"],
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: true,
          containsNuts: true
        },
        season: "Summer",
        occasion: "Family Dinner",
        equipment: ["Large Pot", "Colander", "Chef's Knife", "Cutting Board", "Large Skillet"],
        cookingMethods: ["Boiling", "Sautéing", "Tossing"],
        dishTypes: ["Main Course", "Pasta Dish"],
        servings: {
          amount: 6,
          unit: "serving"
        },
        totalTime: "45 min",
        steps: [
          {
            title: "Prep Vegetables",
            instructions: "Wash and chop all vegetables into bite-sized pieces.",
            duration: "15 min",
            ingredients: [
              { name: "Cherry Tomatoes", amount: "2", unit: "cup", group: "Main Ingredients" },
              { name: "Zucchini", amount: "2", unit: "piece", group: "Main Ingredients" },
              { name: "Bell Peppers", amount: "2", unit: "piece", group: "Main Ingredients" }
            ]
          },
          {
            title: "Cook Pasta",
            instructions: "Bring a large pot of salted water to boil. Cook pasta according to package instructions.",
            duration: "12 min",
            ingredients: [
              { name: "Whole Grain Pasta", amount: "16", unit: "oz", group: "Main Ingredients" }
            ]
          },
          {
            title: "Sauté Vegetables",
            instructions: "In a large skillet, sauté vegetables in olive oil until tender-crisp.",
            duration: "10 min",
            ingredients: [
              { name: "Olive Oil", amount: "1/4", unit: "cup", group: "Sauce" }
            ]
          },
          {
            title: "Combine and Garnish",
            instructions: "Toss pasta with vegetables, drizzle with remaining olive oil, and garnish with fresh basil and pine nuts.",
            duration: "5 min",
            ingredients: [
              { name: "Fresh Basil", amount: "1", unit: "cup", group: "Garnish" },
              { name: "Pine Nuts", amount: "1/4", unit: "cup", group: "Garnish" }
            ]
          }
        ],
        estimatedCost: "$15-$20"
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
        <Button variant="outline" size="icon" className="w-8 h-8">
          <Wand2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Recipe Suggestions</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {!suggestions && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Describe your recipe idea</Label>
                  <Textarea
                    id="description"
                    placeholder="E.g., I want to make a healthy vegetarian pasta dish with Mediterranean flavors..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={generateSuggestions} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating Suggestions..." : "Generate Suggestions"}
                </Button>
              </>
            )}

            {suggestions && (
              <div className="space-y-6">
                {suggestions.images && suggestions.images.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Suggested Images:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {suggestions.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Suggestion ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Recipe Details:</h3>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <strong>Title:</strong> {suggestions.title}
                    </div>
                    <div>
                      <strong>Description:</strong> {suggestions.description}
                    </div>
                    
                    <div>
                      <strong>Ingredients:</strong>
                      <ul className="list-disc pl-5 mt-2">
                        {suggestions.ingredients?.map((ing, index) => (
                          <li key={index}>
                            {ing.amount} {ing.unit} {ing.name} ({ing.group})
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Categories:</strong> {suggestions.categories?.join(", ")}
                    </div>

                    <div>
                      <strong>Dietary Information:</strong>
                      <ul className="list-disc pl-5 mt-2">
                        {suggestions.dietaryInfo && Object.entries(suggestions.dietaryInfo).map(([key, value]) => (
                          <li key={key}>{key.replace(/^is|^contains/, '')}: {value ? "Yes" : "No"}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Cuisine:</strong> {suggestions.cuisine}
                    </div>

                    <div>
                      <strong>Season:</strong> {suggestions.season}
                    </div>

                    <div>
                      <strong>Occasion:</strong> {suggestions.occasion}
                    </div>

                    <div>
                      <strong>Required Equipment:</strong> {suggestions.equipment?.join(", ")}
                    </div>

                    <div>
                      <strong>Cooking Methods:</strong> {suggestions.cookingMethods?.join(", ")}
                    </div>

                    <div>
                      <strong>Dish Types:</strong> {suggestions.dishTypes?.join(", ")}
                    </div>

                    <div>
                      <strong>Servings:</strong> {suggestions.servings?.amount} {suggestions.servings?.unit}
                    </div>

                    <div>
                      <strong>Total Time:</strong> {suggestions.totalTime}
                    </div>

                    <div>
                      <strong>Estimated Cost:</strong> {suggestions.estimatedCost}
                    </div>

                    <div>
                      <strong>Recipe Steps:</strong>
                      <div className="space-y-3 mt-2">
                        {suggestions.steps?.map((step, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="font-medium">{step.title} ({step.duration})</div>
                            <p className="mt-1">{step.instructions}</p>
                            <div className="text-sm text-muted-foreground mt-1">
                              Ingredients: {step.ingredients?.join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
