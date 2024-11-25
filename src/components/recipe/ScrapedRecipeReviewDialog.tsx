import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Camera, Check } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { MultiSelect } from "@/components/MultiSelect";
import { COOKING_EQUIPMENT } from "@/types/recipe";

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
    ...cleanScrapedRecipe(scrapedRecipe)
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
      ...cleanScrapedRecipe(scrapedRecipe)
    });
  }, [scrapedRecipe]);

  const handleFieldChange = (field: string, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Recipe Details</DialogTitle>
          <DialogDescription>
            Please review and edit the scraped information below.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recipe Title</Label>
                <Input
                  value={recipe.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={recipe.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Cuisine Type</Label>
                <Input
                  value={recipe.cuisine || ''}
                  onChange={(e) => handleFieldChange('cuisine', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Servings Amount</Label>
                  <Input
                    type="number"
                    value={recipe.servings?.amount || ''}
                    onChange={(e) => handleFieldChange('servings', { 
                      ...recipe.servings,
                      amount: parseInt(e.target.value) || 0 
                    })}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Serving Unit</Label>
                  <Input
                    value={recipe.servings?.unit || ''}
                    onChange={(e) => handleFieldChange('servings', {
                      ...recipe.servings,
                      unit: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cooking Methods</Label>
                <Input
                  value={recipe.cookingMethods?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('cookingMethods', 
                    e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                  )}
                  placeholder="e.g., fry, bake, steam"
                />
              </div>

              <div className="space-y-2">
                <Label>Required Equipment</Label>
                <MultiSelect
                  options={COOKING_EQUIPMENT}
                  selected={recipe.equipment || []}
                  onChange={(equipment) => handleFieldChange('equipment', equipment)}
                  placeholder="Select required equipment"
                />
              </div>

              <div className="space-y-2">
                <Label>Ingredients</Label>
                <div className="border rounded-md p-4 space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={ingredient.name}
                        onChange={(e) => {
                          const newIngredients = [...(recipe.ingredients || [])];
                          newIngredients[index] = { ...ingredient, name: e.target.value };
                          handleFieldChange('ingredients', newIngredients);
                        }}
                        className="flex-1"
                      />
                      <Input
                        value={ingredient.amount}
                        onChange={(e) => {
                          const newIngredients = [...(recipe.ingredients || [])];
                          newIngredients[index] = { ...ingredient, amount: e.target.value };
                          handleFieldChange('ingredients', newIngredients);
                        }}
                        className="w-20"
                        placeholder="Amount"
                      />
                      <Input
                        value={ingredient.unit}
                        onChange={(e) => {
                          const newIngredients = [...(recipe.ingredients || [])];
                          newIngredients[index] = { ...ingredient, unit: e.target.value };
                          handleFieldChange('ingredients', newIngredients);
                        }}
                        className="w-20"
                        placeholder="Unit"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newIngredients = recipe.ingredients?.filter((_, i) => i !== index);
                          handleFieldChange('ingredients', newIngredients);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions</Label>
                <div className="border rounded-md p-4 space-y-2">
                  {recipe.steps?.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...(recipe.steps || [])];
                          newSteps[index] = { ...step, title: e.target.value };
                          handleFieldChange('steps', newSteps);
                        }}
                        placeholder="Step title"
                      />
                      <Textarea
                        value={step.instructions}
                        onChange={(e) => {
                          const newSteps = [...(recipe.steps || [])];
                          newSteps[index] = { ...step, instructions: e.target.value };
                          handleFieldChange('steps', newSteps);
                        }}
                        placeholder="Step instructions"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSteps = recipe.steps?.filter((_, i) => i !== index);
                          handleFieldChange('steps', newSteps);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Step
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

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

function cleanScrapedRecipe(recipe: Partial<Recipe>): Partial<Recipe> {
  if (!recipe) return {};

  // Remove duplicate ingredients
  const uniqueIngredients = recipe.ingredients ? 
    Array.from(new Set(recipe.ingredients.map(i => JSON.stringify(i))))
      .map(str => JSON.parse(str))
      .filter(ing => ing.name && !ing.name.includes("Ingredienser") && !ing.name.includes("instructions")) : [];

  // Clean up steps
  const cleanedSteps = recipe.steps ? 
    recipe.steps
      .filter(step => 
        step.instructions && 
        !step.instructions.includes("Ingredienser") &&
        !step.instructions.includes("curry currysås") &&
        step.instructions.length > 10
      )
      .map(step => ({
        ...step,
        instructions: step.instructions.trim()
      }))
      .filter((step, index, self) => 
        self.findIndex(s => s.instructions === step.instructions) === index
      ) : [];

  return {
    ...recipe,
    ingredients: uniqueIngredients,
    steps: cleanedSteps
  };
}