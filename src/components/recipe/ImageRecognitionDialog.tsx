import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { createWorker } from 'tesseract.js';
import { analyzeRecipeText } from "@/utils/recipeTextAnalysis";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipes: Partial<Recipe>[]) => void;
}

export function ImageRecognitionDialog({ 
  open, 
  onOpenChange, 
  onRecipeScanned 
}: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    console.log("Processing captured image:", file.name);
    const imageUrl = URL.createObjectURL(file);
    
    try {
      const worker = await createWorker('eng+swe');
      console.log("Tesseract worker created successfully");
      
      const { data: { text } } = await worker.recognize(file);
      console.log("Recognized text:", text); // Log complete recognized text
      
      await worker.terminate();

      const analyzedRecipe = await analyzeRecipeText(text);
      console.log("Recipe analyzed:", analyzedRecipe);
      
      return {
        ...analyzedRecipe,
        images: [imageUrl],
        featuredImageIndex: 0
      };
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  };

  const handleImageCapture = async (files: FileList) => {
    setLoading(true);
    const recipes: Partial<Recipe>[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const processedRecipe = await processImage(files[i]);
        recipes.push(processedRecipe);
      }

      if (recipes.length === 0) {
        throw new Error("No recipes could be extracted from the images");
      }

      onRecipeScanned(recipes);
      onOpenChange(false);
      
      toast({
        title: "Recipe scanned successfully",
        description: `Found ${recipes.length} recipe${recipes.length > 1 ? 's' : ''} in your images`,
      });
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Error processing images",
        description: "Failed to process one or more images. Please try again with clearer photos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Take Photos of Your Recipes</DialogTitle>
          <DialogDescription>
            Take clear photos of your recipes and we'll help you digitize them.
            You can upload multiple recipe photos - each will be processed separately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="h-32 flex flex-col gap-2"
              disabled={loading}
            >
              <Camera className="h-8 w-8" />
              {loading ? "Processing..." : "Take Photo"}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-32 flex flex-col gap-2"
              disabled={loading}
            >
              <Upload className="h-8 w-8" />
              Upload Images
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2">Processing images...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleImageCapture(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleImageCapture(e.target.files)}
        />
      </DialogContent>
    </Dialog>
  );
}