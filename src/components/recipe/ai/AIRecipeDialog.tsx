import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface AIRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRecipe: Partial<Recipe>;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function AIRecipeDialog({
  open,
  onOpenChange,
  currentRecipe,
  isGenerating,
  onGenerate
}: AIRecipeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating Suggestions..." : "Generate AI Suggestions"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}