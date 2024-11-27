import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { importFromTrello } from "@/utils/recipeScraper";
import { Recipe } from "@/types/recipe";

interface TrelloImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeImported: (recipe: Partial<Recipe>) => void;
}

export function TrelloImportDialog({ open, onOpenChange, onRecipeImported }: TrelloImportDialogProps) {
  const [cardUrl, setCardUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardUrl.trim()) return;

    setLoading(true);
    try {
      // Extract card ID from URL
      const cardId = cardUrl.split('/').pop() || '';
      const importedRecipe = await importFromTrello(cardId);
      onRecipeImported(importedRecipe);
      onOpenChange(false);
      toast({
        title: "Recipe imported successfully",
        description: "The recipe details have been imported from Trello.",
      });
    } catch (error) {
      toast({
        title: "Failed to import recipe",
        description: "Could not import recipe from Trello. Please try again.",
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
          <DialogTitle>Import Recipe from Trello</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Paste Trello card URL"
            value={cardUrl}
            onChange={(e) => setCardUrl(e.target.value)}
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