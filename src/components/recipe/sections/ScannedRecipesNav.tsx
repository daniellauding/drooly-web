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
  console.log("ScannedRecipesNav - Current recipes:", {
    recipesCount: scannedRecipes.length,
    recipes: scannedRecipes.map(r => ({
      id: r.id,
      title: r.title,
      ingredients: r.ingredients?.length
    })),
    activeIndex: activeRecipeIndex
  });

  if (scannedRecipes.length <= 1) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Scanned Recipes</h3>
      <Tabs 
        value={activeRecipeIndex.toString()} 
        onValueChange={(value) => {
          console.log("Tab selection changed to:", value);
          onRecipeSelect(parseInt(value));
        }}
        className="w-full"
      >
        <TabsList className="w-full">
          {scannedRecipes.map((recipe, index) => {
            console.log("Rendering tab for recipe:", {
              index,
              id: recipe.id,
              title: recipe.title?.slice(0, 30)
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