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
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File): Promise<Partial<Recipe> | null> => {
    console.log("Processing captured image:", file.name);
    
    try {
      const worker = await createWorker('eng+swe');
      console.log("Tesseract worker created successfully");
      
      const { data: { text } } = await worker.recognize(file);
      console.log("Recognized text from image:", file.name, text);
      
      await worker.terminate();

      const analyzedRecipe = await analyzeRecipeText(text);
      console.log("Recipe analyzed from image:", file.name, analyzedRecipe);
      
      // Create blob URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      return {
        ...analyzedRecipe,
        images: [imageUrl],
        featuredImageIndex: 0,
        sourceFile: file.name // Add this to help track which file created which recipe
      };
    } catch (error) {
      console.error("Error processing image:", file.name, error);
      return null;
    }
  };

  const handleImageCapture = async (files: FileList) => {
    console.log("Starting to process", files.length, "images");
    setLoading(true);
    const recipes: Partial<Recipe>[] = [];
    const newProcessedFiles = new Set(processedFiles);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        
        if (newProcessedFiles.has(fileId)) {
          console.log("Skipping duplicate file:", file.name);
          continue;
        }

        console.log("Processing file:", file.name);
        const processedRecipe = await processImage(file);
        if (processedRecipe) {
          console.log("Successfully processed recipe from:", file.name);
          recipes.push(processedRecipe);
          newProcessedFiles.add(fileId);
        }
      }

      if (recipes.length === 0) {
        throw new Error("No recipes could be extracted from the images");
      }

      console.log("Successfully processed all images. Total recipes:", recipes.length);
      setProcessedFiles(newProcessedFiles);
      
      // Ensure each recipe has a unique ID
      const recipesWithIds = recipes.map((recipe, index) => ({
        ...recipe,
        id: `scanned-${Date.now()}-${index}`
      }));
      
      onRecipeScanned(recipesWithIds);
      onOpenChange(false);
      
      toast({
        title: `Recipe${recipes.length > 1 ? 's' : ''} created from photo${recipes.length > 1 ? 's' : ''}`,
        description: "You can now edit and customize the recipe details."
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