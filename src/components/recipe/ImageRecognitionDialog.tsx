import { useState, useRef } from "react";
import { Worker, createWorker } from "tesseract.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Check, X, Edit2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { analyzeRecipeText } from "@/utils/recipeTextAnalysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScanned: (recipe: Partial<Recipe>) => void;
}

interface ExtractedField {
  label: string;
  key: string;
  value: string;
  editable: boolean;
}

export function ImageRecognitionDialog({ open, onOpenChange, onRecipeScanned }: ImageRecognitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [editableFields, setEditableFields] = useState<ExtractedField[]>([]);
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
      
      // Convert analyzed data to editable fields
      const fields: ExtractedField[] = [
        { label: "Recipe Title", key: "title", value: analyzed.title || "", editable: true },
        { label: "Cuisine Type", key: "cuisine", value: analyzed.cuisine || "", editable: true },
        { label: "Number of Servings", key: "servings", value: analyzed.servings?.amount?.toString() || "", editable: true },
        { label: "Cooking Methods", key: "cookingMethods", value: analyzed.cookingMethods?.join(", ") || "", editable: true },
        { label: "Required Equipment", key: "equipment", value: analyzed.equipment?.join(", ") || "", editable: true }
      ];
      setEditableFields(fields);

      await worker.terminate();
      
      toast({
        title: "Text extracted from image",
        description: "Please review and edit the information below if needed.",
      });
    } catch (error) {
      console.error("Error scanning recipe:", error);
      toast({
        title: "Couldn't read the image",
        description: "Please try taking another photo with better lighting and focus.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (index: number, newValue: string) => {
    const updatedFields = [...editableFields];
    updatedFields[index] = { ...updatedFields[index], value: newValue };
    setEditableFields(updatedFields);
  };

  const handleConfirm = () => {
    if (!extractedData) return;

    // Convert editable fields back to recipe format
    const updatedRecipe: Partial<Recipe> = {
      ...extractedData,
      title: editableFields.find(f => f.key === "title")?.value || "",
      cuisine: editableFields.find(f => f.key === "cuisine")?.value || "",
      cookingMethods: editableFields.find(f => f.key === "cookingMethods")?.value.split(",").map(s => s.trim()) || [],
      equipment: editableFields.find(f => f.key === "equipment")?.value.split(",").map(s => s.trim()) || [],
      servings: {
        amount: parseInt(editableFields.find(f => f.key === "servings")?.value || "0"),
        unit: "serving"
      }
    };

    onRecipeScanned(updatedRecipe);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Take a Photo of Your Recipe</DialogTitle>
          <DialogDescription>
            Take a clear photo of your recipe, and we'll help you extract the information
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
              {loading ? "Reading your recipe..." : "Take Photo"}
            </Button>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {editableFields.map((field, index) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-sm font-medium">{field.label}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFieldChange(index, "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
              <Button variant="outline" onClick={() => {
                setExtractedData(null);
                setEditableFields([]);
              }}>
                <Camera className="mr-2 h-4 w-4" />
                Take Another Photo
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                Use This Recipe
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}