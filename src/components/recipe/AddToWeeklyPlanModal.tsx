import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/SingleSelect";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { RecipeCard } from "../RecipeCard";
import { useQuery } from "@tanstack/react-query";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
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
        : allRecipes;
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
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <Label>Search Recipes</Label>
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className={`cursor-pointer ${selectedRecipe?.id === recipe.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setTitle(recipe.title);
                    }}
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.images?.[0]}
                      cookTime={recipe.totalTime}
                      difficulty={recipe.difficulty}
                      chef={recipe.creatorName}
                      onDismiss={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                placeholder="e.g., Family dinner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Day</Label>
              <SingleSelect
                options={DAYS}
                selected={selectedDay}
                onChange={setSelectedDay}
                placeholder="Select day"
              />
            </div>

            <div>
              <Label>Meal Type</Label>
              <SingleSelect
                options={MEAL_TYPES}
                selected={mealType}
                onChange={setMealType}
                placeholder="Select meal type"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Add to Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}