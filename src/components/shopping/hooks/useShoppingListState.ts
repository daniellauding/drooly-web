import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function useShoppingListState(userId: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to useShoppingListState");
      return;
    }
    
    console.log("Initializing shopping list state for user:", userId);
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

  return {
    recipes,
    ingredients,
    setIngredients
  };
}