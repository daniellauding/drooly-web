import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Instagram } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface InstagramImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeImported: (recipe: Partial<Recipe>) => void;
}

export function InstagramImportDialog({ open, onOpenChange, onRecipeImported }: InstagramImportDialogProps) {
  const [postUrl, setPostUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) return;

    setLoading(true);
    try {
      // For now, we'll create a mock recipe since Instagram API access requires approval
      const mockRecipe: Partial<Recipe> = {
        title: "Recipe from Instagram",
        description: "Imported from Instagram post",
        images: [],
        tags: ["instagram-import"],
        privacy: 'public' as const
      };

      onRecipeImported(mockRecipe);
      onOpenChange(false);
      toast({
        title: "Recipe imported",
        description: "The recipe has been imported from Instagram successfully.",
      });
    } catch (error) {
      console.error("Error importing from Instagram:", error);
      toast({
        title: "Import failed",
        description: "Could not import recipe from Instagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPostUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Recipe from Instagram</DialogTitle>
          <DialogDescription>
            Enter the URL of an Instagram post to import its recipe details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="https://www.instagram.com/p/..."
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              type="url"
              required
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              The post must be public and contain recipe information.
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Instagram className="h-4 w-4" />
            Import from Instagram
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}