import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types/recipe";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/ImageUpload";

interface ScrapedRecipeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scrapedRecipe: Partial<Recipe>;
  onConfirm: (recipe: Partial<Recipe>) => void;
}

export function ScrapedRecipeReviewDialog({
  open,
  onOpenChange,
  scrapedRecipe,
  onConfirm
}: ScrapedRecipeReviewDialogProps) {
  const [recipe, setRecipe] = React.useState<Partial<Recipe>>(scrapedRecipe);

  React.useEffect(() => {
    setRecipe(scrapedRecipe);
  }, [scrapedRecipe]);

  const handleConfirm = () => {
    onConfirm(recipe);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Scraped Recipe</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {recipe.source === 'scrape' && recipe.sourceUrl && (
              <div className="text-sm text-muted-foreground">
                Scraped from: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{recipe.sourceUrl}</a>
              </div>
            )}

            <div className="space-y-2">
              <Label>Images</Label>
              <ImageUpload
                images={recipe.images || []}
                featuredImageIndex={0}
                onChange={(images, featuredIndex) => 
                  setRecipe(prev => ({ ...prev, images, featuredImageIndex: featuredIndex }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={recipe.title}
                onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={recipe.description}
                onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Ingredients</Label>
              <div className="space-y-2">
                {recipe.ingredients?.map((ing, index) => (
                  <Input
                    key={index}
                    value={ing.name}
                    onChange={(e) => {
                      const newIngredients = [...(recipe.ingredients || [])];
                      newIngredients[index] = { ...ing, name: e.target.value };
                      setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Steps</Label>
              <div className="space-y-2">
                {recipe.steps?.map((step, index) => (
                  <Textarea
                    key={index}
                    value={step.instructions}
                    onChange={(e) => {
                      const newSteps = [...(recipe.steps || [])];
                      newSteps[index] = { ...step, instructions: e.target.value };
                      setRecipe(prev => ({ ...prev, steps: newSteps }));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Use Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}