import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion, increment, Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Check } from "lucide-react";

export function ShoppingListContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (user) {
      loadCheckedItems();
      loadShoppingList();
    }
  }, [user]);

  const loadCheckedItems = async () => {
    if (!user) {
      console.log("No user found, skipping loadCheckedItems");
      return;
    }
    try {
      console.log("Loading checked items from Firestore");
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        const checkedArray = listDoc.data().checkedItems || [];
        console.log("Loaded checked items:", checkedArray);
        setCheckedItems(new Set(checkedArray));
      } else {
        console.log("No shopping list document found, creating empty one");
        await setDoc(listRef, { checkedItems: [], updatedAt: Timestamp.now() });
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

  const loadShoppingList = async () => {
    if (!user) {
      console.log("No user found, skipping loadShoppingList");
      return;
    }
    try {
      console.log("Fetching recipes marked as want to cook");
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", user.uid)
      );

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
    } catch (error) {
      console.error("Error loading shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list",
        variant: "destructive"
      });
    }
  };

  const handleCheck = async (ingredient: IngredientItem) => {
    if (!user) {
      console.log("No user found, skipping handleCheck");
      return;
    }
    console.log("Handling check for ingredient:", ingredient.name);
    
    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    
    if (!checkedItems.has(key)) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    console.log("Updated checked items:", Array.from(newChecked));
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
  };

  const saveCheckedItems = async (items: Set<string>) => {
    if (!user) {
      console.log("No user found, skipping saveCheckedItems");
      return;
    }
    try {
      console.log("Saving checked items to Firestore");
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      await setDoc(listRef, {
        checkedItems: Array.from(items),
        updatedAt: Timestamp.now()
      }, { merge: true });
      console.log("Successfully saved checked items");
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive"
      });
    }
  };

  const removeIngredient = (ingredient: IngredientItem) => {
    setIngredients(prev => prev.filter(ing => 
      !(ing.name === ingredient.name && ing.recipeId === ingredient.recipeId)
    ));
  };

  const markRecipeAsCooked = async (recipeId: string) => {
    if (!user) return;
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      
      // Update recipe stats
      await updateDoc(recipeRef, {
        "stats.cookedBy": arrayUnion(user.uid),
        "stats.cookedCount": increment(1)
      });

      // Remove from want to cook list
      const updatedRecipes = recipes.filter(r => r.id !== recipeId);
      setRecipes(updatedRecipes);

      // Remove ingredients from this recipe
      setIngredients(prev => prev.filter(ing => ing.recipeId !== recipeId));

      // Add to user's cooked recipes collection
      const cookedRef = doc(db, "users", user.uid, "cookedRecipes", recipeId);
      await setDoc(cookedRef, {
        cookedAt: Timestamp.now(),
        recipeId
      });

      toast({
        title: "Recipe marked as cooked",
        description: "Recipe has been moved to your cooked list"
      });
    } catch (error) {
      console.error("Error marking recipe as cooked:", error);
      toast({
        title: "Error",
        description: "Failed to mark recipe as cooked",
        variant: "destructive"
      });
    }
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.recipeId]) {
      acc[ing.recipeId] = [];
    }
    acc[ing.recipeId].push(ing);
    return acc;
  }, {} as Record<string, IngredientItem[]>);

  return (
    <div className="space-y-6">
      {recipes.map(recipe => (
        <Card key={recipe.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markRecipeAsCooked(recipe.id)}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark as Cooked
              </Button>
              <div className="text-sm text-muted-foreground">
                {recipe.stats?.cookedCount || 0} people have cooked this
              </div>
            </div>
          </div>
          
          {groupedIngredients[recipe.id]?.map((ingredient, idx) => (
            <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
              <div className="flex items-center gap-4 py-2">
                <Checkbox
                  checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                  onCheckedChange={() => handleCheck(ingredient)}
                />
                <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {idx < groupedIngredients[recipe.id].length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
