import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, ChefHat } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
  recipeId: string;
  recipeTitle: string;
  bought: boolean;
}

interface RecipeProgress {
  total: number;
  checked: number;
  percentage: number;
}

export default function Ingredients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [recipeProgress, setRecipeProgress] = useState<Record<string, RecipeProgress>>({});

  // Load checked items from Firebase
  useEffect(() => {
    const loadCheckedItems = async () => {
      if (!user) return;

      try {
        const checkedItemsDoc = await getDoc(doc(db, "users", user.uid, "shoppingList", "checkedItems"));
        if (checkedItemsDoc.exists()) {
          const data = checkedItemsDoc.data();
          setCheckedItems(new Set(data.items));
          console.log("Loaded checked items:", data.items);
        }
      } catch (error) {
        console.error("Error loading checked items:", error);
      }
    };

    loadCheckedItems();
  }, [user]);

  useEffect(() => {
    const fetchWantToCookRecipes = async () => {
      if (!user) return;

      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", user.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedRecipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Recipe[];

        setRecipes(fetchedRecipes);

        const allIngredients = fetchedRecipes.flatMap(recipe =>
          recipe.ingredients.map(ing => ({
            ...ing,
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            bought: false
          }))
        );

        setIngredients(allIngredients);
        
        // Initialize progress for each recipe
        const initialProgress: Record<string, RecipeProgress> = {};
        fetchedRecipes.forEach(recipe => {
          initialProgress[recipe.id] = {
            total: recipe.ingredients.length,
            checked: 0,
            percentage: 0
          };
        });
        setRecipeProgress(initialProgress);

        // Update progress based on loaded checked items
        updateProgressForAllRecipes(checkedItems);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast({
          title: "Error",
          description: "Failed to load your cooking list",
          variant: "destructive"
        });
      }
    };

    fetchWantToCookRecipes();
  }, [user, checkedItems]);

  const updateProgressForAllRecipes = (checkedSet: Set<string>) => {
    const newProgress: Record<string, RecipeProgress> = {};
    
    recipes.forEach(recipe => {
      const recipeIngredients = ingredients.filter(ing => ing.recipeId === recipe.id);
      const checkedCount = recipeIngredients.reduce((count, ing) => {
        return count + (checkedSet.has(`${ing.recipeId}-${ing.name}`) ? 1 : 0);
      }, 0);

      newProgress[recipe.id] = {
        total: recipe.ingredients.length,
        checked: checkedCount,
        percentage: (checkedCount / recipe.ingredients.length) * 100
      };
    });

    setRecipeProgress(newProgress);
  };

  const handleCheck = async (ingredient: IngredientItem) => {
    if (!user) return;

    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    const isNowChecked = !checkedItems.has(key);
    
    if (isNowChecked) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    setCheckedItems(newChecked);

    // Save to Firebase
    try {
      await setDoc(doc(db, "users", user.uid, "shoppingList", "checkedItems"), {
        items: Array.from(newChecked)
      });
      console.log("Saved checked items to Firebase:", Array.from(newChecked));
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive"
      });
    }

    // Update progress for the recipe
    setRecipeProgress(prev => {
      const recipeId = ingredient.recipeId;
      const currentProgress = prev[recipeId];
      const newCheckedCount = ingredients
        .filter(ing => ing.recipeId === recipeId)
        .reduce((count, ing) => {
          const ingKey = `${ing.recipeId}-${ing.name}`;
          return count + (newChecked.has(ingKey) ? 1 : 0);
        }, 0);

      return {
        ...prev,
        [recipeId]: {
          ...currentProgress,
          checked: newCheckedCount,
          percentage: (newCheckedCount / currentProgress.total) * 100
        }
      };
    });
  };

  const clearChecked = async () => {
    if (!user) return;

    setCheckedItems(new Set());
    
    // Clear in Firebase
    try {
      await setDoc(doc(db, "users", user.uid, "shoppingList", "checkedItems"), {
        items: []
      });
      console.log("Cleared checked items in Firebase");
    } catch (error) {
      console.error("Error clearing checked items:", error);
    }

    // Reset progress for all recipes
    setRecipeProgress(prev => {
      const resetProgress: Record<string, RecipeProgress> = {};
      Object.keys(prev).forEach(recipeId => {
        resetProgress[recipeId] = {
          ...prev[recipeId],
          checked: 0,
          percentage: 0
        };
      });
      return resetProgress;
    });
    
    toast({
      title: "Shopping list cleared",
      description: "All items have been unchecked"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping List</h1>
          {checkedItems.size > 0 && (
            <Button variant="outline" onClick={clearChecked}>
              Clear All
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Ingredients</TabsTrigger>
            <TabsTrigger value="by-recipe">By Recipe</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card className="p-6">
              {ingredients.map((ingredient, idx) => (
                <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
                  <div className="flex items-center gap-4 py-2">
                    <Checkbox
                      checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                      onCheckedChange={() => handleCheck(ingredient)}
                    />
                    <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {ingredient.recipeTitle}
                    </span>
                  </div>
                  {idx < ingredients.length - 1 && <Separator />}
                </div>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="by-recipe" className="mt-6">
            <div className="space-y-6">
              {recipes.map(recipe => (
                <Card key={recipe.id} className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChefHat className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  </div>
                  <div className="mb-4">
                    <Progress value={recipeProgress[recipe.id]?.percentage || 0} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {recipeProgress[recipe.id]?.checked || 0} of {recipeProgress[recipe.id]?.total || 0} ingredients checked
                    </p>
                  </div>
                  <div className="space-y-2">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <div key={`${recipe.id}-${ingredient.name}-${idx}`}>
                        <div className="flex items-center gap-4 py-2">
                          <Checkbox
                            checked={checkedItems.has(`${recipe.id}-${ingredient.name}`)}
                            onCheckedChange={() => handleCheck({
                              ...ingredient,
                              recipeId: recipe.id,
                              recipeTitle: recipe.title,
                              bought: false
                            })}
                          />
                          <span className={checkedItems.has(`${recipe.id}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </span>
                        </div>
                        {idx < recipe.ingredients.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}