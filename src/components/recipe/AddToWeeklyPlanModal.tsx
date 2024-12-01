import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/SingleSelect";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipe";

interface AddToWeeklyPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId?: string;
  recipeTitle?: string;
  recipeImage?: string;
}

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(
    initialRecipeId && initialRecipeTitle ? {
      id: initialRecipeId,
      title: initialRecipeTitle,
      images: initialRecipeImage ? [initialRecipeImage] : [],
    } as Recipe : null
  );

  useEffect(() => {
    if (user) {
      loadCustomIngredients();
    }
  }, [user]);

  const loadCustomIngredients = async () => {
    if (!user) return;

    try {
      console.log("Loading custom ingredients for user:", user.uid);
      const customIngredientsRef = doc(db, "users", user.uid, "customIngredients", "current");
      const docSnap = await getDoc(customIngredientsRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Loaded custom ingredients:", data);
        // Handle the loaded custom ingredients if needed
      }
    } catch (error) {
      console.error("Error loading custom ingredients:", error);
    }
  };

  const searchRecipes = async (query: string) => {
    if (!query || !query.trim() || !user) return;

    try {
      console.log("Searching recipes with query:", query);
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("title", ">=", query.toLowerCase()),
        where("title", "<=", query.toLowerCase() + "\uf8ff")
      );
      
      const querySnapshot = await getDocs(q);
      const results: Recipe[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Recipe;
        results.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log("Found recipes:", results.length);
      setRecipes(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      console.log("Submitting weekly plan:", {
        title,
        selectedDay,
        mealType,
        selectedRecipe
      });

      const weeklyPlanDoc = await addDoc(collection(db, "weeklyPlans"), {
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

      console.log("Weekly plan created:", weeklyPlanDoc.id);

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Weekly Cooking Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <Label>Search Recipe (optional)</Label>
              <Command className="rounded-lg border shadow-md">
                <CommandInput 
                  placeholder="Search recipes..." 
                  value={searchQuery}
                  onValueChange={(value) => {
                    setSearchQuery(value);
                    searchRecipes(value);
                  }}
                />
                {recipes.length > 0 && (
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {recipes.map((recipe) => (
                      <CommandItem
                        key={recipe.id}
                        value={recipe.title}
                        onSelect={() => {
                          setSelectedRecipe(recipe);
                          setSearchQuery("");
                          setRecipes([]);
                          setTitle(recipe.title);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRecipe?.id === recipe.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {recipe.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandEmpty>No recipes found.</CommandEmpty>
              </Command>
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