import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { useToast } from "@/hooks/use-toast";

export function ShoppingListContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      console.log("Loading shopping list for user:", user.uid);
      loadShoppingList();
      loadCheckedItems();
    }
  }, [user]);

  const loadCheckedItems = async () => {
    if (!user) return;
    try {
      console.log("Loading checked items from Firestore");
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        const checkedArray = listDoc.data().checkedItems || [];
        console.log("Loaded checked items:", checkedArray);
        setCheckedItems(new Set(checkedArray));
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
    if (!user) return;
    try {
      console.log("Fetching recipes marked as want to cook");
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];

      console.log("Found recipes:", recipes.length);

      const allIngredients = recipes.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          bought: false
        }))
      );

      console.log("Processed ingredients:", allIngredients.length);
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
    if (!user) return;
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
    if (!user) return;
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

  return (
    <Card className="p-6">
      <div className="space-y-4">
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
      </div>
    </Card>
  );
}