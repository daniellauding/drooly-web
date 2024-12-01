import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';

export function useShoppingList(userId: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      console.log("Loading shopping list for user:", userId);
      loadCheckedItems();
      loadShoppingList();
    }
  }, [userId]);

  const loadCheckedItems = async () => {
    if (!userId) return;
    try {
      console.log("Loading checked items...");
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        console.log("Found existing checked items:", listDoc.data().checkedItems);
        setCheckedItems(new Set(listDoc.data().checkedItems || []));
      } else {
        console.log("No existing checked items found");
        await setDoc(listRef, { 
          checkedItems: [], 
          updatedAt: Timestamp.now(),
          recurringItems: []
        });
      }
    } catch (error) {
      console.error("Error loading checked items:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadShoppingList = async () => {
    if (!userId) return;
    try {
      console.log("Loading recipes for shopping list...");
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", userId)
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];

      console.log("Fetched recipes:", fetchedRecipes.length);
      setRecipes(fetchedRecipes);

      const allIngredients = fetchedRecipes.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          bought: false
        }))
      );

      // Load recurring items
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      const recurringItems = listDoc.exists() ? listDoc.data().recurringItems || [] : [];

      console.log("Total ingredients:", allIngredients.length + recurringItems.length);
      setIngredients([...allIngredients, ...recurringItems]);
    } catch (error) {
      console.error("Error loading shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheck = async (ingredient: IngredientItem) => {
    if (!userId) return;

    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    
    if (!checkedItems.has(key)) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
  };

  const handleCheckAll = async (ingredients: IngredientItem[]) => {
    if (!userId) return;

    const newChecked = new Set(checkedItems);
    const allChecked = ingredients.every(ing => 
      checkedItems.has(`${ing.recipeId}-${ing.name}`)
    );
    
    ingredients.forEach(ing => {
      const key = `${ing.recipeId}-${ing.name}`;
      if (allChecked) {
        newChecked.delete(key);
      } else {
        newChecked.add(key);
      }
    });

    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
  };

  const handleRemoveIngredient = async (ingredient: IngredientItem) => {
    console.log("Removing ingredient:", ingredient);
    setIngredients(prev => prev.filter(ing => 
      !(ing.recipeId === ingredient.recipeId && ing.name === ingredient.name)
    ));
    
    const key = `${ingredient.recipeId}-${ingredient.name}`;
    if (checkedItems.has(key)) {
      const newChecked = new Set(checkedItems);
      newChecked.delete(key);
      await saveCheckedItems(newChecked);
    }
  };

  const saveCheckedItems = async (items: Set<string>) => {
    if (!userId) return;
    try {
      console.log("Saving checked items:", Array.from(items));
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      const recurringItems = listDoc.exists() ? listDoc.data().recurringItems || [] : [];

      await setDoc(listRef, {
        checkedItems: Array.from(items),
        updatedAt: Timestamp.now(),
        recurringItems
      });

      if (items.size > 0) {
        const checkedIngredients = ingredients.filter(ing => 
          items.has(`${ing.recipeId}-${ing.name}`)
        );
        
        console.log("Adding to history:", checkedIngredients.length, "items");
        await addDoc(collection(db, "users", userId, "shoppingHistory"), {
          items: checkedIngredients,
          checkedAt: Timestamp.now(),
          recurrence: "none"
        });
      }

      toast({
        title: "Saved",
        description: "Your shopping list has been updated",
      });
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addCustomIngredient = async (name: string, amount: string, unit: string) => {
    const customIngredient: IngredientItem = {
      name,
      amount,
      unit,
      recipeId: 'custom',
      recipeTitle: 'Custom Items',
      bought: false
    };
    setIngredients(prev => [...prev, customIngredient]);
  };

  const setRecurring = async (ingredient: IngredientItem, recurrence: "none" | "weekly" | "monthly") => {
    if (!userId) return;
    try {
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      let recurringItems = listDoc.exists() ? listDoc.data().recurringItems || [] : [];

      if (recurrence === "none") {
        recurringItems = recurringItems.filter(item => 
          !(item.name === ingredient.name && item.amount === ingredient.amount)
        );
      } else {
        const existingIndex = recurringItems.findIndex(item => 
          item.name === ingredient.name && item.amount === ingredient.amount
        );
        
        if (existingIndex >= 0) {
          recurringItems[existingIndex] = { ...ingredient, recurrence };
        } else {
          recurringItems.push({ ...ingredient, recurrence });
        }
      }

      await setDoc(listRef, {
        checkedItems: Array.from(checkedItems),
        updatedAt: Timestamp.now(),
        recurringItems
      }, { merge: true });

      toast({
        title: "Updated",
        description: `Item set to ${recurrence} recurring`,
      });

      loadShoppingList(); // Reload to get updated recurring items
    } catch (error) {
      console.error("Error updating recurring items:", error);
      toast({
        title: "Error",
        description: "Failed to update recurring items",
        variant: "destructive"
      });
    }
  };

  return {
    recipes,
    ingredients,
    checkedItems,
    handleCheck,
    handleCheckAll,
    handleRemoveIngredient,
    addCustomIngredient,
    setRecurring
  };
}