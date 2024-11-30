import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { parseAIDescription } from "@/utils/aiRecipeParser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePreviewDialog } from "./ImagePreviewDialog";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

export function ImageRecognitionDialog({ 
  open, 
  onOpenChange, 
  onRecipeScanned 
}: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageCapture = async (file: File) => {
    console.log("Processing captured image:", file.name);
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    setLoading(true);

    try {
      // Simulate AI description (replace with actual API call)
      const aiDescription = "This meal looks delicious! It's a beautifully plated dish with seared steak topped with herb butter, creamy scalloped potatoes, and a fresh side salad with pears.";
      
      console.log("Received AI description:", aiDescription);
      const parsedRecipe = parseAIDescription(aiDescription);
      
      // Add the captured image to the recipe
      parsedRecipe.images = [imageUrl];
      
      onRecipeScanned(parsedRecipe);
      onOpenChange(false);
      
      toast({
        title: "Recipe created from photo",
        description: "The recipe has been created based on the AI analysis.",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error processing image",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Take a Photo of Your Recipe</DialogTitle>
            <DialogDescription>
              Take a clear photo of your dish and let AI help create the recipe.
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
                Upload Image
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2">Analyzing image...</span>
              </div>
            )}

            {capturedImage && (
              <div className="relative group">
                <img
                  src={capturedImage}
                  alt="Captured recipe"
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={() => setPreviewImage(capturedImage)}
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageCapture(file);
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageCapture(file);
            }}
          />
        </DialogContent>
      </Dialog>

      {previewImage && (
        <ImagePreviewDialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
          imageUrl={previewImage}
        />
      )}
    </>
  );
}