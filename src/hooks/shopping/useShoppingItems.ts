import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';

export function useShoppingItems(userId: string | undefined) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const loadCheckedItems = async () => {
      if (!userId) return;

      try {
        console.log("Loading checked items and custom ingredients for user:", userId);
        
        // Load checked items
        const listRef = doc(db, "users", userId, "shoppingLists", "current");
        const listDoc = await getDoc(listRef);
        
        if (listDoc.exists()) {
          const data = listDoc.data();
          setCheckedItems(new Set(data.checkedItems || []));
        }

        // Load custom ingredients
        const customIngredientsRef = collection(db, "users", userId, "customIngredients");
        const customIngredientsSnapshot = await getDocs(customIngredientsRef);
        
        const customIngredients = customIngredientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log("Loaded custom ingredients:", customIngredients);
        
        // Update current shopping list with custom ingredients if they exist
        if (customIngredients.length > 0) {
          await setDoc(listRef, {
            ingredients: customIngredients,
            updatedAt: new Date()
          }, { merge: true });
        }
      } catch (error) {
        console.error("Error loading checked items and custom ingredients:", error);
      }
    };

    loadCheckedItems();
  }, [userId]);

  const saveCheckedItems = async (newChecked: Set<string>, ingredients: IngredientItem[]) => {
    if (!userId) return;

    try {
      console.log("Saving checked items and custom ingredients:", {
        checkedItems: Array.from(newChecked),
        customIngredients: ingredients.filter(ing => ing.recipeId === 'custom')
      });

      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      
      // Save to current shopping list
      await setDoc(listRef, {
        checkedItems: Array.from(newChecked),
        ingredients: ingredients.filter(ing => ing.recipeId === 'custom'),
        updatedAt: new Date()
      }, { merge: true });

      // Save custom ingredients to separate collection for persistence
      const customIngredientsRef = collection(db, "users", userId, "customIngredients");
      const customIngredients = ingredients.filter(ing => ing.recipeId === 'custom');
      
      // Get existing custom ingredients
      const snapshot = await getDocs(customIngredientsRef);
      const existingIngredients = new Set(snapshot.docs.map(doc => doc.data().name));

      // Add new custom ingredients
      for (const ingredient of customIngredients) {
        if (!existingIngredients.has(ingredient.name)) {
          await setDoc(doc(customIngredientsRef), {
            ...ingredient,
            createdAt: new Date()
          });
        }
      }

    } catch (error) {
      console.error("Error saving checked items and custom ingredients:", error);
      toast({
        title: "Error",
        description: "Failed to save your shopping list. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    checkedItems,
    setCheckedItems,
    saveCheckedItems
  };
}