import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { generateRecipeSuggestions } from "@/services/openaiService";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AISuggestionsProps {
  onSuggestionsApply: (suggestions: Partial<Recipe>) => void;
  currentRecipe: Partial<Recipe>;
}

export function AISuggestions({ onSuggestionsApply, currentRecipe }: AISuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Partial<Recipe> | null>(null);
  const [showRemixButton, setShowRemixButton] = useState(false);
  const [mergeOption, setMergeOption] = useState<'keep' | 'replace' | 'merge'>('keep');
  const { toast } = useToast();

  const hasExistingData = !!(
    currentRecipe.title ||
    currentRecipe.description ||
    (currentRecipe.ingredients && currentRecipe.ingredients.length > 0) ||
    (currentRecipe.steps && currentRecipe.steps.length > 0)
  );

  const capitalizeIngredients = (suggestions: Partial<Recipe>) => {
    if (suggestions.ingredients) {
      return {
        ...suggestions,
        ingredients: suggestions.ingredients.map(ing => ({
          ...ing,
          name: ing.name.charAt(0).toUpperCase() + ing.name.slice(1)
        }))
      };
    }
    return suggestions;
  };

  const mergeRecipes = (current: Partial<Recipe>, ai: Partial<Recipe>): Partial<Recipe> => {
    return {
      ...current,
      title: current.title || ai.title,
      description: `${current.description || ''}\n${ai.description || ''}`.trim(),
      ingredients: [...(current.ingredients || []), ...(ai.ingredients || [])],
      steps: [...(current.steps || []), ...(ai.steps || [])],
      categories: [...new Set([...(current.categories || []), ...(ai.categories || [])])],
      cookingMethods: [...new Set([...(current.cookingMethods || []), ...(ai.cookingMethods || [])])],
      equipment: [...new Set([...(current.equipment || []), ...(ai.equipment || [])])],
      tags: [...new Set([...(current.tags || []), ...(ai.tags || [])])],
    };
  };

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const suggestions = await generateRecipeSuggestions(currentRecipe);
      const capitalizedSuggestions = capitalizeIngredients(suggestions);
      
      if (hasExistingData) {
        setAiSuggestions(capitalizedSuggestions);
        setShowConfirmDialog(true);
      } else {
        onSuggestionsApply(capitalizedSuggestions);
        setIsOpen(false);
        setShowRemixButton(true);
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

  const handleConfirmChoice = () => {
    if (!aiSuggestions) return;

    let finalRecipe: Partial<Recipe>;
    switch (mergeOption) {
      case 'keep':
        return;
      case 'replace':
        finalRecipe = aiSuggestions;
        break;
      case 'merge':
        finalRecipe = mergeRecipes(currentRecipe, aiSuggestions);
        break;
      default:
        return;
    }

    onSuggestionsApply(finalRecipe);
    setShowConfirmDialog(false);
    setIsOpen(false);
    setShowRemixButton(true);
    toast({
      title: "Success",
      description: `Recipe has been ${mergeOption === 'merge' ? 'merged with' : 'replaced by'} AI suggestions`
    });
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
            <AlertDialogTitle>How would you like to use the AI suggestions?</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how to incorporate the AI-generated suggestions into your recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <RadioGroup value={mergeOption} onValueChange={(value: 'keep' | 'replace' | 'merge') => setMergeOption(value)} className="gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="keep" id="keep" />
              <Label htmlFor="keep">Keep current data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="replace" id="replace" />
              <Label htmlFor="replace">Use AI suggestions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="merge" id="merge" />
              <Label htmlFor="merge">Merge current data with AI suggestions</Label>
            </div>
          </RadioGroup>

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmChoice}>Confirm</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}