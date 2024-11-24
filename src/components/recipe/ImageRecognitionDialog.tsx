import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const worker = await createWorker();
      const imageUrl = URL.createObjectURL(file);
      
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log("Recognized text:", text);

      // Basic parsing of recognized text
      const recipeData: Partial<Recipe> = {
        title: text.split("\n")[0], // First line as title
        description: text.split("\n").slice(1).join("\n"), // Rest as description
        images: [imageUrl]
      };

      await worker.terminate();
      onRecipeScanned(recipeData);
      onOpenChange(false);
      
      toast({
        title: "Recipe scanned successfully",
        description: "The recipe details have been extracted from the image.",
      });
    } catch (error) {
      console.error("Error scanning recipe:", error);
      toast({
        title: "Failed to scan recipe",
        description: "Could not extract recipe details from the image. Please try again or enter details manually.",
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
            Take a photo of a printed recipe to automatically import its details
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