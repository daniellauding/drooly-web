import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { generateRecipeSuggestions } from "@/services/openaiService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AISuggestionsProps {
  onSuggestionsApply: (suggestions: Partial<Recipe>) => void;
  currentRecipe: Partial<Recipe>;
}

export function AISuggestions({ onSuggestionsApply, currentRecipe }: AISuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Partial<Recipe> | null>(null);
  const { toast } = useToast();

  const hasExistingData = !!(
    currentRecipe.title ||
    currentRecipe.description ||
    (currentRecipe.ingredients && currentRecipe.ingredients.length > 0) ||
    (currentRecipe.steps && currentRecipe.steps.length > 0)
  );

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const suggestions = await generateRecipeSuggestions(currentRecipe);
      
      if (hasExistingData) {
        setAiSuggestions(suggestions);
        setShowConfirmDialog(true);
      } else {
        onSuggestionsApply(suggestions);
        setIsOpen(false);
        toast({
          title: "Success",
          description: "AI suggestions have been applied to your recipe"
        });
      }
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

  const handleConfirmOverwrite = () => {
    if (aiSuggestions) {
      onSuggestionsApply(aiSuggestions);
      setShowConfirmDialog(false);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "AI suggestions have been applied to your recipe"
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-8 h-8"
      >
        <Wand2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AI Recipe Suggestions</DialogTitle>
            <DialogDescription>
              Our AI will analyze your current recipe data and provide enhancements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-medium">Current Recipe Data:</h3>
              <p>Title: {currentRecipe.title || "Not set"}</p>
              <p>Description: {currentRecipe.description || "Not set"}</p>
              <p>Ingredients: {currentRecipe.ingredients?.length || 0} items</p>
              <p>Steps: {currentRecipe.steps?.length || 0} steps</p>
            </div>

            <Button 
              onClick={handleGenerateSuggestions} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? "Generating Suggestions..." : "Generate AI Suggestions"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keep Existing Data?</AlertDialogTitle>
            <AlertDialogDescription>
              You have existing recipe data. Would you like to keep your current data or replace it with AI suggestions?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Keep Current Data</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOverwrite}>Use AI Suggestions</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}