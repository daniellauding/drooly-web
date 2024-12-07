import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { IngredientItem } from '@/components/shopping/types';
import { useShoppingItems } from './shopping/useShoppingItems';
import { useRecurringItems } from './shopping/useRecurringItems';
import { useIngredientOperations } from './shopping/useIngredientOperations';

export function useShoppingList(userId: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { 
    checkedItems, 
    setCheckedItems, 
    saveCheckedItems,
    customIngredients 
  } = useShoppingItems(userId);
  const { setRecurring } = useRecurringItems(userId);
  const { 
    ingredients, 
    setIngredients, 
    handleUpdateIngredient, 
    addCustomIngredient 
  } = useIngredientOperations(userId);

  // Load recipes and their ingredients
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

      const recipeIngredients = fetchedRecipes.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          bought: false
        }))
      );

      // Combine recipe ingredients with custom ingredients
      const allIngredients = [...recipeIngredients, ...customIngredients];
      console.log("Total ingredients:", allIngredients.length);
      setIngredients(allIngredients);
    } catch (error) {
      console.error("Error loading shopping list:", error);
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
    await saveCheckedItems(newChecked, ingredients);
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
    await saveCheckedItems(newChecked, ingredients);
  };

  const handleRemoveIngredient = async (ingredient: IngredientItem) => {
    if (!userId) return;

    console.log("Removing ingredient:", ingredient);
    const updatedIngredients = ingredients.filter(ing => 
      !(ing.recipeId === ingredient.recipeId && ing.name === ingredient.name)
    );
    setIngredients(updatedIngredients);
    
    const key = `${ingredient.recipeId}-${ingredient.name}`;
    if (checkedItems.has(key)) {
      const newChecked = new Set(checkedItems);
      newChecked.delete(key);
      await saveCheckedItems(newChecked, updatedIngredients);
    }
  };

  return {
    recipes,
    ingredients,
    checkedItems,
    handleCheck,
    handleCheckAll,
    handleRemoveIngredient,
    handleUpdateIngredient,
    addCustomIngredient,
    setRecurring
  };
}