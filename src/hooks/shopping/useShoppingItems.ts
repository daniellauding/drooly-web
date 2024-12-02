import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
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
        console.log("Loading checked items for user:", userId);
        const listRef = doc(db, "users", userId, "shoppingLists", "current");
        const listDoc = await getDoc(listRef);
        
        if (listDoc.exists()) {
          const data = listDoc.data();
          setCheckedItems(new Set(data.checkedItems || []));
        }
      } catch (error) {
        console.error("Error loading checked items:", error);
      }
    };

    loadCheckedItems();
  }, [userId]);

  const saveCheckedItems = async (newChecked: Set<string>, ingredients: IngredientItem[]) => {
    if (!userId) return;

    try {
      console.log("Saving checked items:", Array.from(newChecked));
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      
      // Get current custom ingredients
      const listDoc = await getDoc(listRef);
      const currentData = listDoc.exists() ? listDoc.data() : {};
      
      await setDoc(listRef, {
        ...currentData,
        checkedItems: Array.from(newChecked),
        ingredients: ingredients.filter(ing => ing.recipeId === 'custom'),
        updatedAt: new Date()
      }, { merge: true });

      // Save custom ingredients separately for persistence
      const customIngredientsRef = collection(db, "users", userId, "customIngredients");
      for (const ingredient of ingredients.filter(ing => ing.recipeId === 'custom')) {
        await addDoc(customIngredientsRef, {
          ...ingredient,
          createdAt: new Date()
        });
      }

    } catch (error) {
      console.error("Error saving checked items:", error);
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