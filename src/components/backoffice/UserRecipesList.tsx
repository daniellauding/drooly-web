import { TableCell, TableRow } from "@/components/ui/table";

interface UserRecipesListProps {
  recipes: any[];
}

export function UserRecipesList({ recipes }: UserRecipesListProps) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="bg-muted/30 p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">User's Recipes</h3>
          {recipes && recipes.length > 0 ? (
            <div className="grid gap-4">
              {recipes.map((recipe: any) => (
                <div key={recipe.id} className="p-4 bg-background rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{recipe.title || recipe.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recipe.description || 'No description'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {recipe.tags?.map((tag: string) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recipes created yet</p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}