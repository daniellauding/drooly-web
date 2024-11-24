import { useState, useRef } from "react";
import { Worker, createWorker } from "tesseract.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Check, X } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { analyzeRecipeText } from "@/utils/recipeTextAnalysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

interface ExtractedData {
  title: string;
  cuisine: string;
  servings?: { amount: number; unit: string };
  cookingMethods: string[];
  equipment: string[];
  ingredients: { name: string; amount: string; unit: string; }[];
  steps: { title: string; instructions: string; duration: string; media: string[]; }[];
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const worker = await createWorker();
      const imageUrl = URL.createObjectURL(file);
      
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log("Recognized text:", text);

      const analyzed = analyzeRecipeText(text);
      setExtractedData(analyzed);
      
      // Initialize all fields as selected
      setSelectedFields(
        Object.keys(analyzed).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {})
      );

      await worker.terminate();
      
      toast({
        title: "Text extracted successfully",
        description: "Please review and confirm the extracted information.",
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

  const handleConfirm = () => {
    if (!extractedData) return;

    const selectedData = Object.entries(selectedFields).reduce((acc, [key, selected]) => {
      if (selected && extractedData[key as keyof ExtractedData]) {
        acc[key as keyof ExtractedData] = extractedData[key as keyof ExtractedData];
      }
      return acc;
    }, {} as Partial<ExtractedData>);

    onRecipeScanned({
      ...selectedData,
      ingredients: selectedData.ingredients?.map(ing => ({
        ...ing,
        group: "Main Ingredients"
      }))
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Take Photo of Recipe</DialogTitle>
          <DialogDescription>
            Take a photo of your recipe to automatically import all details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!extractedData ? (
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
          ) : (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Label className="text-sm font-medium capitalize">{key}</Label>
                      <pre className="mt-1 whitespace-pre-wrap text-sm">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                    <Switch
                      checked={selectedFields[key]}
                      onCheckedChange={(checked) => 
                        setSelectedFields(prev => ({...prev, [key]: checked}))
                      }
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageCapture}
          />

          {extractedData && (
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setExtractedData(null)}>
                <X className="mr-2 h-4 w-4" />
                Retake Photo
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                Confirm Selection
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}