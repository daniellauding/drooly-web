import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, ChefHat } from "lucide-react";

interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
  recipeId: string;
  recipeTitle: string;
  bought: boolean;
}

export default function Ingredients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

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

        // Process ingredients
        const allIngredients = fetchedRecipes.flatMap(recipe =>
          recipe.ingredients.map(ing => ({
            ...ing,
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            bought: false
          }))
        );

        setIngredients(allIngredients);
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
  }, [user]);

  const handleCheck = (ingredient: IngredientItem) => {
    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    
    if (checkedItems.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    
    setCheckedItems(newChecked);
  };

  const clearChecked = () => {
    setCheckedItems(new Set());
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