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
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
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
      setExtractedData(analyzed);
      
      await worker.terminate();
      
      toast({
        title: "Text extracted from image",
        description: "Please review the extracted information below.",
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
    if (capturedImages.length === 1) {
      setExtractedData(null);
    }
  };

  const handleConfirm = () => {
    if (!extractedData) return;
    onRecipeScanned(extractedData);
    onOpenChange(false);
    setCapturedImages([]);
    setExtractedData(null);
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
            {!extractedData && (
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

            {extractedData && (
              <div className="space-y-4">
                <h3 className="font-medium">Extracted Recipe Information</h3>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Title</h4>
                      <p>{extractedData.title || "No title detected"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Ingredients</h4>
                      <ul className="list-disc pl-5">
                        {extractedData.ingredients?.map((ing: any, i: number) => (
                          <li key={i}>{ing.name} - {ing.amount} {ing.unit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Instructions</h4>
                      {extractedData.steps?.map((step: any, i: number) => (
                        <p key={i} className="mb-2">{step.instructions}</p>
                      ))}
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setExtractedData(null)}>
                    Try Again
                  </Button>
                  <Button onClick={handleConfirm}>
                    Use This Recipe
                  </Button>
                </div>
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