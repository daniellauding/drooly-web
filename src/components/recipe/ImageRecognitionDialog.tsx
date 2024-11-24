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

  const extractIngredients = (text: string): { name: string, amount: string, unit: string }[] => {
    console.log("Extracting ingredients from text:", text);
    const lines = text.split('\n');
    const ingredients: { name: string, amount: string, unit: string }[] = [];
    
    // Flatten all ingredients from COMMON_INGREDIENTS into a single array
    const allIngredients = Object.values(COMMON_INGREDIENTS).flat();
    
    lines.forEach(line => {
      // Try to match known ingredients
      const matchedIngredient = allIngredients.find(ingredient => 
        line.toLowerCase().includes(ingredient.toLowerCase())
      );
      
      if (matchedIngredient) {
        // Basic pattern for amount and unit: number followed by unit
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

      // Extract ingredients from the recognized text
      const ingredients = extractIngredients(text);

      // Update recipe with extracted ingredients
      const recipeData: Partial<Recipe> = {
        ingredients: ingredients.map(ing => ({
          ...ing,
          group: "Main Ingredients"
        }))
      };

      await worker.terminate();
      onRecipeScanned(recipeData);
      onOpenChange(false);
      
      toast({
        title: `${ingredients.length} ingredients found`,
        description: "The ingredients have been extracted and added to your recipe.",
      });
    } catch (error) {
      console.error("Error scanning ingredients:", error);
      toast({
        title: "Failed to scan ingredients",
        description: "Could not extract ingredients from the image. Please try again or enter them manually.",
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
          <DialogTitle>Take Photo of Ingredients</DialogTitle>
          <DialogDescription>
            Take a photo of your ingredient list to automatically import them
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