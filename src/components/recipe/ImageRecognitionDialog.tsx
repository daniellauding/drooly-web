import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, X } from "lucide-react";
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());
  const [scannedRecipes, setScannedRecipes] = useState<Partial<Recipe>[]>([]);
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
        sourceFile: file.name,
        id: `scanned-${Date.now()}-${file.name}`
      };
    } catch (error) {
      console.error("Error processing image:", file.name, error);
      return null;
    }
  };

  const handleImageCapture = (files: FileList) => {
    console.log("Adding files to pending list:", files.length);
    const newFiles = Array.from(files);
    setPendingFiles(prev => [...prev, ...newFiles]);
  };

  const handleStartProcessing = async () => {
    if (pendingFiles.length === 0) {
      toast({
        title: "No images to process",
        description: "Please add some images first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const newRecipes: Partial<Recipe>[] = [];
    const newProcessedFiles = new Set(processedFiles);

    try {
      for (const file of pendingFiles) {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        
        if (newProcessedFiles.has(fileId)) {
          console.log("Skipping duplicate file:", file.name);
          continue;
        }

        console.log("Processing file:", file.name);
        const processedRecipe = await processImage(file);
        if (processedRecipe) {
          console.log("Successfully processed recipe from:", file.name);
          newRecipes.push(processedRecipe);
          newProcessedFiles.add(fileId);
        }
      }

      if (newRecipes.length === 0) {
        throw new Error("No recipes could be extracted from the images");
      }

      console.log("Successfully processed all images. Total recipes:", newRecipes.length);
      setProcessedFiles(newProcessedFiles);
      setScannedRecipes(newRecipes);
      onRecipeScanned(newRecipes);
      onOpenChange(false);
      setPendingFiles([]);
      
      toast({
        title: `Recipe${newRecipes.length > 1 ? 's' : ''} created from photo${newRecipes.length > 1 ? 's' : ''}`,
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

  const removeFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Take Photos of Your Recipes</DialogTitle>
          <DialogDescription>
            Take clear photos of your recipes and we'll help you digitize them.
            You can take multiple photos before processing them.
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
              Take Photo
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

          {pendingFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Pending Images ({pendingFiles.length})</h3>
              <div className="grid grid-cols-2 gap-4">
                {pendingFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Pending image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleStartProcessing} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing images...
                  </>
                ) : (
                  'Start Processing'
                )}
              </Button>
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
          className="hidden"
          onChange={(e) => e.target.files && handleImageCapture(e.target.files)}
        />
      </DialogContent>
    </Dialog>
  );
}