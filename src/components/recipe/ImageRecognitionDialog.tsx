import { useState, useRef } from "react";
import { Worker, createWorker } from "tesseract.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Image as ImageIcon, X } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { analyzeRecipeText } from "@/utils/recipeTextAnalysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePreviewDialog } from "./ImagePreviewDialog";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>, rawText: string) => void;
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCapturedImages(prev => [...prev, imageUrl]);

    setLoading(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log("Recognized text:", text);

      const analyzed = analyzeRecipeText(text);
      
      // Pass both the analyzed recipe and raw text to parent
      onRecipeScanned(analyzed, text);
      
      await worker.terminate();
      
      toast({
        title: "Text extracted from image",
        description: "Recipe details have been extracted successfully.",
      });
    } catch (error) {
      console.error("Error scanning recipe:", error);
      toast({
        title: "Couldn't read the image clearly",
        description: "Try taking another photo with better lighting and focus.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Take a Photo of Your Recipe</DialogTitle>
            <DialogDescription>
              Take photos of your recipe book or upload images. We'll help extract the information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!loading && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-32 flex flex-col gap-2"
                >
                  <Camera className="h-8 w-8" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex flex-col gap-2"
                >
                  <Upload className="h-8 w-8" />
                  Upload Image
                </Button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Processing image...</p>
              </div>
            )}

            {capturedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Captured ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setPreviewImage(image)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />
        </DialogContent>
      </Dialog>

      <ImagePreviewDialog
        open={!!previewImage}
        onOpenChange={() => setPreviewImage(null)}
        imageUrl={previewImage}
      />
    </>
  );
}