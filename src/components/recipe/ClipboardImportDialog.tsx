import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clipboard } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { analyzeRecipeText } from "@/utils/recipeTextAnalysis";
import { ScrapedRecipeReviewDialog } from "./ScrapedRecipeReviewDialog";

interface ClipboardImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeImported: (recipe: Partial<Recipe>) => void;
}

export function ClipboardImportDialog({ open, onOpenChange, onRecipeImported }: ClipboardImportDialogProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedRecipe, setParsedRecipe] = useState<Partial<Recipe> | null>(null);
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      toast({
        title: "Clipboard access denied",
        description: "Please paste the text manually into the text area.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please paste some recipe text first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const recipe = await analyzeRecipeText(text);
      setParsedRecipe(recipe);
    } catch (error) {
      console.error("Error analyzing recipe text:", error);
      toast({
        title: "Failed to analyze recipe",
        description: "Could not extract recipe details. Please check the text format.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeConfirm = (recipe: Partial<Recipe>) => {
    onRecipeImported(recipe);
    setText("");
    setParsedRecipe(null);
    onOpenChange(false);
    toast({
      title: "Recipe imported successfully",
      description: "The recipe details have been imported and can now be edited.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import Recipe from Text</DialogTitle>
            <DialogDescription>
              Paste recipe text from your clipboard or any source. We'll try to extract the recipe details automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePaste}
                className="gap-2"
              >
                <Clipboard className="h-4 w-4" />
                Paste from Clipboard
              </Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your recipe text here..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !text.trim()}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Recipe Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {parsedRecipe && (
        <ScrapedRecipeReviewDialog
          open={!!parsedRecipe}
          onOpenChange={(open) => !open && setParsedRecipe(null)}
          scrapedRecipe={parsedRecipe}
          onConfirm={handleRecipeConfirm}
        />
      )}
    </>
  );
}
