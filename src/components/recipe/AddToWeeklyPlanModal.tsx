import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { useQuery } from "@tanstack/react-query";
import { RecipeSearchResults } from "./weekly-plan/RecipeSearchResults";
import { PlanFormFields } from "./weekly-plan/PlanFormFields";

interface AddToWeeklyPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId?: string;
  recipeTitle?: string;
  recipeImage?: string;
}

export function AddToWeeklyPlanModal({
  open,
  onOpenChange,
  recipeId: initialRecipeId,
  recipeTitle: initialRecipeTitle,
  recipeImage: initialRecipeImage
}: AddToWeeklyPlanModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [mealType, setMealType] = useState("Breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(
    initialRecipeId && initialRecipeTitle ? {
      id: initialRecipeId,
      title: initialRecipeTitle,
      images: initialRecipeImage ? [initialRecipeImage] : [],
    } as Recipe : null
  );

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes', searchQuery],
    queryFn: async () => {
      console.log("Fetching recipes for search:", searchQuery);
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("status", "==", "published")
      );
      const snapshot = await getDocs(q);
      const allRecipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      
      return searchQuery
        ? allRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allRecipes.slice(0, 10); // Show latest 10 recipes when no search query
    },
    enabled: open
  });

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a recipe",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Submitting weekly plan:", {
        title,
        selectedDay,
        mealType,
        selectedRecipe
      });

      await addDoc(collection(db, "weeklyPlans"), {
        userId: user.uid,
        owner: user.uid,
        userName: user.displayName || "Anonymous Chef",
        userAvatar: user.photoURL || "/placeholder.svg",
        recipeId: selectedRecipe?.id || null,
        recipeTitle: selectedRecipe?.title || title,
        recipeImage: selectedRecipe?.images?.[0] || null,
        title: title || selectedRecipe?.title,
        day: selectedDay,
        mealType,
        createdAt: new Date(),
        status: "planned",
        collaborators: {}
      });

      toast({
        title: "Success!",
        description: "Added to your weekly cooking plan"
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error adding to weekly plan:", error);
      toast({
        title: "Error",
        description: "Failed to add to weekly plan",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add to Weekly Cooking Plan</DialogTitle>
          <DialogDescription>
            Search for a recipe or create a custom meal plan entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <RecipeSearchResults
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              onSelectRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setTitle(recipe.title);
              }}
            />
          </div>

          <PlanFormFields
            title={title}
            onTitleChange={setTitle}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            mealType={mealType}
            onMealTypeChange={setMealType}
          />

          <Button onClick={handleSubmit} className="w-full">
            Add to Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}