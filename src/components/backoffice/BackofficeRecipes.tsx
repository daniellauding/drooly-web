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
import { ChevronDown, ChevronUp, Heart, MessageSquare, Share2 } from "lucide-react";

export function BackofficeRecipes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const { data: recipes, isLoading, refetch } = useQuery({
    queryKey: ['admin-recipes'],
    queryFn: async () => {
      const recipesRef = collection(db, 'recipes');
      const snapshot = await getDocs(recipesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stats: {
          likes: Math.floor(Math.random() * 100), // Placeholder - implement real stats
          comments: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 30)
        }
      })) as (Recipe & { stats: { likes: number; comments: number; shares: number } })[];
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
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes?.map((recipe) => (
            <>
              <TableRow key={recipe.id} className="hover:bg-muted/50">
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleRowExpansion(recipe.id!)}
                  >
                    {expandedRows.includes(recipe.id!) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{recipe.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>{recipe.stats.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4 text-green-500" />
                      <span>{recipe.stats.shares}</span>
                    </div>
                  </div>
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
              {expandedRows.includes(recipe.id!) && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/30 p-4">
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
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}