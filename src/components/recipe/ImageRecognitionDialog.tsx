import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createWorker } from 'tesseract.js';

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
  const [capturedImages, setCapturedImages] = useState<{ url: string; text?: string }[]>([]);
  const [multipleMode, setMultipleMode] = useState(false);
  const [activeTab, setActiveTab] = useState("0");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    console.log("Processing captured image:", file.name);
    const imageUrl = URL.createObjectURL(file);
    
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      return { url: imageUrl, text };
    } catch (error) {
      console.error("Error processing image:", error);
      return { url: imageUrl };
    }
  };

  const handleImageCapture = async (files: FileList) => {
    setLoading(true);
    const newImages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const processedImage = await processImage(files[i]);
        newImages.push(processedImage);
      }

      setCapturedImages(prev => [...prev, ...newImages]);
      setActiveTab((capturedImages.length).toString());
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Error processing images",
        description: "Failed to process one or more images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = (imageData: { url: string; text?: string }) => {
    const recipe: Partial<Recipe> = {
      images: [imageData.url],
      title: "Recipe from Photo",
      description: imageData.text || "",
      ingredients: [],
      steps: [{
        title: "Instructions",
        instructions: imageData.text || "",
        duration: "",
        media: []
      }]
    };

    onRecipeScanned(recipe);
    if (!multipleMode) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Take Photos of Your Recipes</DialogTitle>
          <DialogDescription>
            Take clear photos of your recipes and we'll help you digitize them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={multipleMode}
              onCheckedChange={setMultipleMode}
              id="multiple-mode"
            />
            <Label htmlFor="multiple-mode">Enable multiple recipe mode</Label>
          </div>

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

          {capturedImages.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                {capturedImages.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    Recipe {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {capturedImages.map((image, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <div className="space-y-4">
                    <img
                      src={image.url}
                      alt={`Recipe ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button 
                      onClick={() => handleCreateRecipe(image)}
                      className="w-full"
                    >
                      Create Recipe {index + 1}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multipleMode}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleImageCapture(e.target.files);
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={multipleMode}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleImageCapture(e.target.files);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}