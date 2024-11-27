import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RecipeTableRow } from "./RecipeTableRow";
import { RecipeExpandedRow } from "./RecipeExpandedRow";

interface BackofficeRecipesProps {
  searchQuery: string;
}

export function BackofficeRecipes({ searchQuery }: BackofficeRecipesProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const { data: recipes, isLoading, refetch } = useQuery({
    queryKey: ['admin-recipes', searchQuery],
    queryFn: async () => {
      console.log("Fetching recipes for backoffice with search:", searchQuery);
      const recipesRef = collection(db, 'recipes');
      const snapshot = await getDocs(recipesRef);
      const allRecipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      
      if (searchQuery) {
        return allRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return allRecipes;
    }
  });

  const handleUpdate = async (id: string, updates: Partial<Recipe>) => {
    try {
      await updateDoc(doc(db, "recipes", id), {
        ...updates,
        updatedAt: new Date()
      });
      toast({
        title: "Recipe updated",
        description: "The recipe has been successfully updated."
      });
      refetch();
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update recipe. Please try again."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      await deleteDoc(doc(db, "recipes", id));
      toast({
        title: "Recipe deleted",
        description: "The recipe has been successfully deleted."
      });
      refetch();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete recipe. Please try again."
      });
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes?.map((recipe) => (
            <>
              <RecipeTableRow
                key={recipe.id}
                recipe={recipe}
                editingId={editingId}
                isExpanded={expandedRows.includes(recipe.id!)}
                onEdit={(id) => setEditingId(id)}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
                onDelete={handleDelete}
                onToggleExpand={() => toggleRowExpansion(recipe.id!)}
              />
              {expandedRows.includes(recipe.id!) && (
                <RecipeExpandedRow 
                  recipe={recipe}
                  onSave={(updates) => handleUpdate(recipe.id!, updates)}
                />
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}