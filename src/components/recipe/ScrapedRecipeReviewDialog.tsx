import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Camera, Check } from "lucide-react";
import { Recipe } from "@/types/recipe";

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
  const [recipe, setRecipe] = React.useState<Partial<Recipe>>({
    title: '',
    description: '',
    privacy: 'private',
    cuisine: '',
    cookingMethods: [],
    equipment: [],
    servings: { amount: 4, unit: 'serving' },
    ...scrapedRecipe
  });

  React.useEffect(() => {
    setRecipe({
      title: '',
      description: '',
      privacy: 'private',
      cuisine: '',
      cookingMethods: [],
      equipment: [],
      servings: { amount: 4, unit: 'serving' },
      ...scrapedRecipe
    });
  }, [scrapedRecipe]);

  const handleFieldChange = (field: string, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Recipe Details</DialogTitle>
          <DialogDescription>
            Please review and edit the information below if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipe Title</Label>
              <div className="relative">
                <Input
                  value={recipe.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="pr-8"
                />
                {recipe.title && (
                  <button
                    onClick={() => handleFieldChange('title', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cuisine Type</Label>
              <div className="relative">
                <Input
                  value={recipe.cuisine || ''}
                  onChange={(e) => handleFieldChange('cuisine', e.target.value)}
                  className="pr-8"
                />
                {recipe.cuisine && (
                  <button
                    onClick={() => handleFieldChange('cuisine', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Servings</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={recipe.servings?.amount || ''}
                  onChange={(e) => handleFieldChange('servings', { 
                    ...recipe.servings,
                    amount: parseInt(e.target.value) || 0 
                  })}
                  className="pr-8"
                  min="1"
                />
                {recipe.servings?.amount && (
                  <button
                    onClick={() => handleFieldChange('servings', { amount: '', unit: 'serving' })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cooking Methods</Label>
              <div className="relative">
                <Input
                  value={recipe.cookingMethods?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('cookingMethods', 
                    e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                  )}
                  className="pr-8"
                  placeholder="e.g., wok, fry, bake"
                />
                {recipe.cookingMethods?.length > 0 && (
                  <button
                    onClick={() => handleFieldChange('cookingMethods', [])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Equipment</Label>
              <div className="relative">
                <Input
                  value={recipe.equipment?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('equipment', 
                    e.target.value.split(',').map(eq => eq.trim()).filter(Boolean)
                  )}
                  className="pr-8"
                  placeholder="e.g., wok, pan, oven"
                />
                {recipe.equipment?.length > 0 && (
                  <button
                    onClick={() => handleFieldChange('equipment', [])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            onClick={() => onConfirm(recipe)}
            className="flex-1"
          >
            <Check className="mr-2 h-4 w-4" />
            Use This Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}