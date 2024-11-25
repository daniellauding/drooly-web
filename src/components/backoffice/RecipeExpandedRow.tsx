import { Recipe } from "@/types/recipe";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecipeExpandedRowProps {
  recipe: Recipe;
}

export function RecipeExpandedRow({ recipe }: RecipeExpandedRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="bg-muted/30 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{recipe.description || 'No description'}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-1">Difficulty</h4>
              <p className="text-sm">{recipe.difficulty || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cooking Time</h4>
              <p className="text-sm">{recipe.totalTime || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cuisine</h4>
              <p className="text-sm">{recipe.cuisine || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.categories?.length > 0 ? (
                recipe.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No categories</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.length > 0 ? (
                recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Dietary Info</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(recipe.dietaryInfo || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <Badge key={key} variant="default" className="bg-green-100 text-green-800">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              {Object.values(recipe.dietaryInfo || {}).every(v => !v) && (
                <span className="text-sm text-muted-foreground">No dietary information</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Cooking Methods</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.cookingMethods?.length > 0 ? (
                  recipe.cookingMethods.map((method, index) => (
                    <Badge key={index} variant="secondary">
                      {method}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No cooking methods specified</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Dish Types</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.dishTypes?.length > 0 ? (
                  recipe.dishTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No dish types specified</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.equipment?.length > 0 ? (
                  recipe.equipment.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No equipment specified</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Servings</h4>
              <p className="text-sm">
                {recipe.servings?.amount ? 
                  `${recipe.servings.amount} ${recipe.servings.unit}${recipe.servings.amount > 1 ? 's' : ''}` : 
                  'Not specified'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Season</h4>
              <p className="text-sm">{recipe.season || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Occasion</h4>
              <p className="text-sm">{recipe.occasion || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Estimated Cost</h4>
            <p className="text-sm">{recipe.estimatedCost || 'Not specified'}</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}