import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function BackofficeRecipes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { data: recipes, isLoading, refetch } = useQuery({
    queryKey: ['admin-recipes'],
    queryFn: async () => {
      const recipesRef = collection(db, 'recipes');
      const snapshot = await getDocs(recipesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
    }
  });

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

  const handleEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    
    try {
      await updateDoc(doc(db, "recipes", id), {
        title: editTitle
      });
      toast({
        title: "Recipe updated",
        description: "The recipe has been successfully updated."
      });
      setEditingId(null);
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes?.map((recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>
                {editingId === recipe.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full"
                    />
                    <Button size="sm" onClick={() => handleEdit(recipe.id!)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      setEditingId(recipe.id!);
                      setEditTitle(recipe.title);
                    }}
                  >
                    {recipe.title}
                  </span>
                )}
              </TableCell>
              <TableCell>{recipe.creatorName || 'Unknown'}</TableCell>
              <TableCell>
                {recipe.createdAt ? new Date(recipe.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => navigate(`/recipe/${recipe.id}`)}>View</Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(recipe.id!)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}