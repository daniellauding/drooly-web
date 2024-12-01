import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScannedRecipesNavProps {
  scannedRecipes: Partial<Recipe>[];
  activeRecipeIndex: number;
  onRecipeSelect: (index: number) => void;
}

export function ScannedRecipesNav({
  scannedRecipes,
  activeRecipeIndex,
  onRecipeSelect
}: ScannedRecipesNavProps) {
  console.log("ScannedRecipesNav - Detailed recipe information:", 
    scannedRecipes.map((recipe, index) => ({
      index,
      id: recipe.id,
      title: recipe.title?.slice(0, 30),
      ingredientsCount: recipe.ingredients?.length,
      ingredients: recipe.ingredients?.map(ing => 
        typeof ing === 'string' ? ing : `${ing.amount} ${ing.unit} ${ing.name}`
      ),
      images: recipe.images,
      sourceFile: recipe.sourceFile
    }))
  );

  if (scannedRecipes.length <= 1) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Scanned Recipes</h3>
      <Tabs 
        value={activeRecipeIndex.toString()} 
        onValueChange={(value) => {
          const newIndex = parseInt(value);
          console.log("Tab selection changed to:", {
            index: newIndex,
            recipe: scannedRecipes[newIndex] ? {
              id: scannedRecipes[newIndex].id,
              title: scannedRecipes[newIndex].title?.slice(0, 30),
              ingredientsCount: scannedRecipes[newIndex].ingredients?.length,
              ingredients: scannedRecipes[newIndex].ingredients?.map(ing => 
                typeof ing === 'string' ? ing : `${ing.amount} ${ing.unit} ${ing.name}`
              ),
              images: scannedRecipes[newIndex].images
            } : 'Recipe not found'
          });
          onRecipeSelect(newIndex);
        }}
        className="w-full"
      >
        <TabsList className="w-full">
          {scannedRecipes.map((recipe, index) => {
            console.log("Rendering tab for recipe:", {
              index,
              id: recipe.id,
              title: recipe.title?.slice(0, 30),
              ingredientsCount: recipe.ingredients?.length,
              firstImage: recipe.images?.[0] || 'No image'
            });
            
            return (
              <TabsTrigger 
                key={recipe.id || index} 
                value={index.toString()}
                className="flex-1"
              >
                Recipe {index + 1} {recipe.sourceFile ? `(${recipe.sourceFile})` : ''}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}