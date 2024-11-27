import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { scrapeRecipe } from "@/utils/recipeScraper";
import { Recipe } from "@/types/recipe";
import { ScrapedRecipeReviewDialog } from "./ScrapedRecipeReviewDialog";

interface RecipeUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScraped: (recipe: Partial<Recipe>) => void;
}

export function RecipeUrlDialog({ open, onOpenChange, onRecipeScraped }: RecipeUrlDialogProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapedRecipe, setScrapedRecipe] = useState<Partial<Recipe> | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const recipe = await scrapeRecipe(url);
      setScrapedRecipe(recipe);
    } catch (error) {
      console.error("Error importing recipe:", error);
      toast({
        title: "Failed to import recipe",
        description: error instanceof Error ? error.message : "Could not extract recipe details. Please try again or enter details manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeConfirm = (recipe: Partial<Recipe>) => {
    onRecipeScraped(recipe);
    setUrl("");
    setScrapedRecipe(null);
    onOpenChange(false);
    toast({
      title: "Recipe imported successfully",
      description: "The recipe details have been imported and can now be edited.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Recipe from URL</DialogTitle>
            <DialogDescription>
              Enter the URL of a recipe to automatically import its details. Currently supported websites include common recipe websites.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="https://example.com/recipe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import Recipe
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ScrapedRecipeReviewDialog
        open={!!scrapedRecipe}
        onOpenChange={(open) => !open && setScrapedRecipe(null)}
        scrapedRecipe={scrapedRecipe || {}}
        onConfirm={handleRecipeConfirm}
      />
    </>
  );
}