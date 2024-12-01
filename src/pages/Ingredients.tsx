import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShoppingListHeader } from "@/components/shopping/ShoppingListHeader";
import { RecipeProgressCard } from "@/components/shopping/RecipeProgressCard";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { IngredientItem, RecipeProgress } from "@/components/shopping/types";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Ingredients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [recipeProgress, setRecipeProgress] = useState<Record<string, RecipeProgress>>({});
  const [listId, setListId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    if (user) {
      setListId(`${user.uid}_shopping_list`);
      loadCheckedItems();
    }
  }, [user]);

  const loadCheckedItems = async () => {
    if (!user) return;
    try {
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        setCheckedItems(new Set(listDoc.data().checkedItems || []));
      }
    } catch (error) {
      console.error("Error loading checked items:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list",
        variant: "destructive"
      });
    }
  };

  const saveCheckedItems = async (items: Set<string>) => {
    if (!user) return;
    try {
      // Save current state
      await setDoc(doc(db, "users", user.uid, "shoppingLists", "current"), {
        checkedItems: Array.from(items),
        updatedAt: Timestamp.now()
      });

      // Add to history if items were checked
      if (items.size > 0) {
        const checkedIngredients = ingredients.filter(ing => 
          items.has(`${ing.recipeId}-${ing.name}`)
        );
        
        await addDoc(collection(db, "users", user.uid, "shoppingHistory"), {
          items: checkedIngredients,
          checkedAt: Timestamp.now(),
          recurrence: "none" // Can be "weekly", "monthly", etc.
        });
      }
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive"
      });
    }
  };

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

  const clearChecked = async () => {
    if (!user) return;
    const newChecked = new Set<string>();
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
    updateProgressForAllRecipes(newChecked);
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">Current List</TabsTrigger>
            <TabsTrigger value="history">Shopping History</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
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
          </TabsContent>

          <TabsContent value="history">
            <ShoppingHistory userId={user?.uid || ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

