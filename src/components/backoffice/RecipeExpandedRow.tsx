import { Recipe } from "@/types/recipe";
import { TableCell, TableRow } from "@/components/ui/table";

interface RecipeExpandedRowProps {
  recipe: Recipe;
}

export function RecipeExpandedRow({ recipe }: RecipeExpandedRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="bg-muted/30 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{recipe.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-1">Difficulty</h4>
              <p className="text-sm">{recipe.difficulty}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cooking Time</h4>
              <p className="text-sm">{recipe.totalTime}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cuisine</h4>
              <p className="text-sm">{recipe.cuisine}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-1">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.categories?.map((category, index) => (
                <span 
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-1">Dietary Info</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(recipe.dietaryInfo || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <span 
                    key={key}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}