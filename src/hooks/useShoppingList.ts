import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';
import { useShoppingItems } from './shopping/useShoppingItems';
import { useRecurringItems } from './shopping/useRecurringItems';

export function useShoppingList(userId: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const { checkedItems, setCheckedItems, saveCheckedItems } = useShoppingItems(userId);
  const { setRecurring } = useRecurringItems(userId);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to useShoppingList");
      return;
    }
    
    console.log("Initializing shopping list for user:", userId);
    loadShoppingList();
  }, [userId]);

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

      console.log("Fetched recipes count:", fetchedRecipes.length);
      setRecipes(fetchedRecipes);

      const allIngredients = fetchedRecipes.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          bought: false
        }))
      );

      console.log("Total ingredients:", allIngredients.length);
      setIngredients(allIngredients);
    } catch (error) {
      console.error("Error loading shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list. Please check your internet connection and try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheck = async (ingredient: IngredientItem) => {
    if (!userId) {
      console.log("Cannot check item: No user ID");
      return;
    }

    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    
    if (!checkedItems.has(key)) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked, ingredients);

    // Add to history if item was checked
    if (newChecked.has(key)) {
      try {
        await addDoc(collection(db, "users", userId, "shoppingHistory"), {
          items: [ingredient],
          checkedAt: Timestamp.now(),
          recurrence: "none"
        });
      } catch (error) {
        console.error("Error adding to history:", error);
      }
    }
  };

  const handleCheckAll = async (ingredients: IngredientItem[]) => {
    if (!userId) {
      console.log("Cannot check all: No user ID");
      return;
    }

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
    await saveCheckedItems(newChecked, ingredients);
  };

  const handleRemoveIngredient = async (ingredient: IngredientItem) => {
    if (!userId) {
      console.log("Cannot remove ingredient: No user ID");
      return;
    }

    console.log("Removing ingredient:", ingredient);
    setIngredients(prev => prev.filter(ing => 
      !(ing.recipeId === ingredient.recipeId && ing.name === ingredient.name)
    ));
    
    const key = `${ingredient.recipeId}-${ingredient.name}`;
    if (checkedItems.has(key)) {
      const newChecked = new Set(checkedItems);
      newChecked.delete(key);
      await saveCheckedItems(newChecked, ingredients);
    }
  };

  const addCustomIngredient = async (name: string, amount: string, unit: string) => {
    if (!userId) {
      console.log("Cannot add custom ingredient: No user ID");
      return;
    }

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