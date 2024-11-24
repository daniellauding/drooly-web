import { useState, useRef } from "react";
import { Worker, createWorker } from "tesseract.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { COMMON_INGREDIENTS } from "@/components/ingredients/CommonIngredients";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const extractRecipeInfo = (text: string) => {
    console.log("Extracting recipe info from text:", text);
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract title (usually first non-empty line)
    const title = lines[0] || "";
    
    // Extract ingredients
    const ingredients = extractIngredients(text);
    
    // Try to identify cooking time
    const timeMatch = text.toLowerCase().match(/(\d+)[-\s]*(min|minutes|hour|hours)/);
    const totalTime = timeMatch ? timeMatch[0] : "";
    
    // Try to identify servings
    const servingsMatch = text.toLowerCase().match(/(\d+)\s*(servings|portions|persons|people)/);
    const servings = servingsMatch ? {
      amount: parseInt(servingsMatch[1]),
      unit: "serving"
    } : undefined;
    
    // Try to extract cooking instructions
    const instructionsStart = lines.findIndex(line => 
      line.toLowerCase().includes("instructions") || 
      line.toLowerCase().includes("directions") ||
      line.toLowerCase().includes("method") ||
      line.toLowerCase().includes("steps")
    );
    
    const description = instructionsStart !== -1 
      ? lines.slice(1, instructionsStart).join("\n")
      : lines.slice(1, Math.min(5, lines.length)).join("\n");
    
    const steps = instructionsStart !== -1 
      ? [{ 
          title: "Instructions",
          instructions: lines.slice(instructionsStart + 1).join("\n"),
          duration: "",
          media: []
        }]
      : undefined;

    return {
      title,
      description,
      ingredients,
      totalTime,
      servings,
      steps
    };
  };

  const extractIngredients = (text: string): { name: string, amount: string, unit: string }[] => {
    console.log("Extracting ingredients from text:", text);
    const lines = text.split('\n');
    const ingredients: { name: string, amount: string, unit: string }[] = [];
    
    const allIngredients = Object.values(COMMON_INGREDIENTS).flat();
    
    lines.forEach(line => {
      const matchedIngredient = allIngredients.find(ingredient => 
        line.toLowerCase().includes(ingredient.toLowerCase())
      );
      
      if (matchedIngredient) {
        const amountMatch = line.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
        
        ingredients.push({
          name: matchedIngredient,
          amount: amountMatch?.[1] || "",
          unit: amountMatch?.[2] || ""
        });
      }
    });

    console.log("Extracted ingredients:", ingredients);
    return ingredients;
  };

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const worker = await createWorker();
      const imageUrl = URL.createObjectURL(file);
      
      await worker.load();
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log("Recognized text:", text);

      const extractedInfo = extractRecipeInfo(text);
      
      const recipeData: Partial<Recipe> = {
        title: extractedInfo.title,
        description: extractedInfo.description,
        ingredients: extractedInfo.ingredients.map(ing => ({
          ...ing,
          group: "Main Ingredients"
        })),
        totalTime: extractedInfo.totalTime,
        ...(extractedInfo.servings && { servings: extractedInfo.servings }),
        ...(extractedInfo.steps && { steps: extractedInfo.steps }),
        images: [imageUrl]
      };

      await worker.terminate();
      onRecipeScanned(recipeData);
      onOpenChange(false);
      
      toast({
        title: "Recipe details extracted",
        description: `Found ${extractedInfo.ingredients.length} ingredients and additional recipe details.`,
      });
    } catch (error) {
      console.error("Error scanning recipe:", error);
      toast({
        title: "Failed to scan recipe",
        description: "Could not extract recipe details from the image. Please try again or enter them manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Photo of Recipe</DialogTitle>
          <DialogDescription>
            Take a photo of your recipe to automatically import all details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-2 h-4 w-4" />
            )}
            {loading ? "Processing..." : "Take Photo"}
          </Button>
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageCapture}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}