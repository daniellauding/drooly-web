import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { scrapeRecipe } from "@/utils/recipeScraper";
import { Recipe } from "@/types/recipe";

interface RecipeUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeScraped: (recipe: Partial<Recipe>) => void;
}

export function RecipeUrlDialog({ open, onOpenChange, onRecipeScraped }: RecipeUrlDialogProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const scrapedRecipe = await scrapeRecipe(url);
      onRecipeScraped(scrapedRecipe);
      onOpenChange(false);
      toast({
        title: "Recipe imported successfully",
        description: "The recipe details have been filled in from the provided URL.",
      });
    } catch (error) {
      toast({
        title: "Failed to import recipe",
        description: "Could not extract recipe details from the provided URL. Please try again or enter details manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Recipe from URL</DialogTitle>
          <DialogDescription>
            Enter the URL of a recipe to automatically import its details
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
  );
}