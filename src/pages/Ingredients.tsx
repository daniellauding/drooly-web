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
import { useToast } from "@/hooks/use-toast";
import { ShoppingListHeader } from "@/components/shopping/ShoppingListHeader";
import { RecipeProgressCard } from "@/components/shopping/RecipeProgressCard";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { IngredientItem, RecipeProgress } from "@/components/shopping/types";

export default function Ingredients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [recipeProgress, setRecipeProgress] = useState<Record<string, RecipeProgress>>({});
  const [listId, setListId] = useState<string>("");

  useEffect(() => {
    if (user) {
      // Generate a unique list ID for the user if not exists
      setListId(`${user.uid}_shopping_list`);
    }
  }, [user]);

  useEffect(() => {
    const loadCheckedItems = async () => {
      if (!user) return;
      try {
        const checkedItemsDoc = await getDoc(doc(db, "users", user.uid, "shoppingList", "checkedItems"));
        if (checkedItemsDoc.exists()) {
          setCheckedItems(new Set(checkedItemsDoc.data().items));
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
        
        const initialProgress: Record<string, RecipeProgress> = {};
        fetchedRecipes.forEach(recipe => {
          initialProgress[recipe.id] = {
            total: recipe.ingredients.length,
            checked: 0,
            percentage: 0
          };
        });
        setRecipeProgress(initialProgress);

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
    
    if (!checkedItems.has(key)) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
    updateProgressForAllRecipes(newChecked);
  };

  const saveCheckedItems = async (items: Set<string>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "shoppingList", "checkedItems"), {
        items: Array.from(items)
      });
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive"
      });
    }
  };

  const clearChecked = async () => {
    if (!user) return;
    setCheckedItems(new Set());
    await saveCheckedItems(new Set());
    updateProgressForAllRecipes(new Set());
    toast({
      title: "Shopping list cleared",
      description: "All items have been unchecked"
    });
  };

  const markAllAsBought = async () => {
    if (!user) return;
    const allKeys = ingredients.map(ing => `${ing.recipeId}-${ing.name}`);
    const newChecked = new Set(allKeys);
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
    updateProgressForAllRecipes(newChecked);
    toast({
      title: "All items marked as bought",
      description: "Your shopping list has been completed"
    });
  };

  const handleAddCustomIngredient = async (name: string, amount: string, unit: string) => {
    const customIngredient: IngredientItem = {
      name,
      amount,
      unit,
      recipeId: 'custom',
      recipeTitle: 'Other Items',
      bought: false
    };
    setIngredients(prev => [...prev, customIngredient]);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-8">
        <ShoppingListHeader
          checkedItemsCount={checkedItems.size}
          onClearAll={clearChecked}
          onMarkAllBought={markAllAsBought}
          userId={user?.uid || ""}
          listId={listId}
        />

        <CustomIngredientAdd onAdd={handleAddCustomIngredient} />

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
                <RecipeProgressCard
                  key={recipe.id}
                  recipe={recipe}
                  progress={recipeProgress[recipe.id]}
                  checkedItems={checkedItems}
                  onCheck={handleCheck}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
