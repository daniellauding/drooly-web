import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { formatRecipeData } from "@/utils/recipeFormatters";

interface UserRecipesListProps {
  userId: string;
  recipes?: Recipe[];
}

export function UserRecipesList({ userId, recipes: initialRecipes }: UserRecipesListProps) {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['user-recipes', userId],
    queryFn: async () => {
      if (initialRecipes) {
        return initialRecipes;
      }

      console.log('Fetching recipes for user:', userId);
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('creatorId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No recipes found for user');
        return [];
      }

      const userRecipes = snapshot.docs.map(formatRecipeData);
      console.log('Found recipes:', userRecipes);
      return userRecipes;
    },
    initialData: initialRecipes
  });

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="h-24 text-center">
          Loading recipes...
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={8} className="bg-muted/30 p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">User's Recipes ({recipes?.length || 0})</h3>
          {recipes && recipes.length > 0 ? (
            <div className="grid gap-4">
              {recipes.map((recipe: Recipe) => (
                <div key={recipe.id} className="p-4 bg-background rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{recipe.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {recipe.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recipe.description}
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