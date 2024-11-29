import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { generateRecipeSuggestions } from "@/services/openaiService";
import { searchPhotos, triggerPhotoDownload, UnsplashPhoto } from "@/services/unsplashService";
import { AIConfirmDialog } from "./ai/AIConfirmDialog";
import { AIPhotoDialog } from "./ai/AIPhotoDialog";
import { AIRecipeDialog } from "./ai/AIRecipeDialog";

interface AISuggestionsProps {
  onSuggestionsApply: (suggestions: Partial<Recipe>) => void;
  currentRecipe: Partial<Recipe>;
}

export function AISuggestions({ onSuggestionsApply, currentRecipe }: AISuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Partial<Recipe> | null>(null);
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [showRemixButton, setShowRemixButton] = useState(false);
  const [mergeOption, setMergeOption] = useState<'keep' | 'replace' | 'merge'>('keep');
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    console.log("Generating AI suggestions for recipe");
    setIsGenerating(true);
    try {
      const suggestions = await generateRecipeSuggestions(currentRecipe);
      setAiSuggestions(suggestions);
      
      // Search for photos based on the recipe title
      const photos = await searchPhotos(suggestions.title || currentRecipe.title || "recipe");
      setUnsplashPhotos(photos);
      
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate suggestions",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoSelect = async (photo: UnsplashPhoto) => {
    console.log("Selected photo:", photo.id);
    await triggerPhotoDownload(photo.id);
    
    if (!aiSuggestions) return;
    
    const updatedSuggestions = {
      ...aiSuggestions,
      images: [photo.urls.regular]
    };
    
    onSuggestionsApply(updatedSuggestions);
    setShowPhotoDialog(false);
    setIsOpen(false);
    setShowRemixButton(true);
    
    toast({
      title: "Success",
      description: "Recipe and photo have been updated"
    });
  };

  const handleConfirmChoice = () => {
    if (!aiSuggestions) return;

    if (mergeOption === 'keep') {
      setShowConfirmDialog(false);
      return;
    }

    if (mergeOption === 'merge') {
      const mergedRecipe = {
        ...currentRecipe,
        title: currentRecipe.title || aiSuggestions.title,
        description: `${currentRecipe.description || ''}\n${aiSuggestions.description || ''}`.trim(),
        ingredients: [...(currentRecipe.ingredients || []), ...(aiSuggestions.ingredients || [])],
        steps: [...(currentRecipe.steps || []), ...(aiSuggestions.steps || [])],
        categories: [...new Set([...(currentRecipe.categories || []), ...(aiSuggestions.categories || [])])],
        cookingMethods: [...new Set([...(currentRecipe.cookingMethods || []), ...(aiSuggestions.cookingMethods || [])])],
        equipment: [...new Set([...(currentRecipe.equipment || []), ...(aiSuggestions.equipment || [])])],
        tags: [...new Set([...(currentRecipe.tags || []), ...(aiSuggestions.tags || [])])],
      };
      setAiSuggestions(mergedRecipe);
    }

    setShowConfirmDialog(false);
    setShowPhotoDialog(true);
  };

  return (
    <>
      {showRemixButton ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsOpen(true);
            setShowRemixButton(false);
          }}
          className="w-8 h-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="w-8 h-8"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      )}

      <AIRecipeDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        currentRecipe={currentRecipe}
        isGenerating={isGenerating}
        onGenerate={handleGenerateSuggestions}
      />

      <AIConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmChoice}
        mergeOption={mergeOption}
        setMergeOption={setMergeOption}
      />

      <AIPhotoDialog
        open={showPhotoDialog}
        onOpenChange={setShowPhotoDialog}
        photos={unsplashPhotos}
        onPhotoSelect={handlePhotoSelect}
      />
    </>
  );
}