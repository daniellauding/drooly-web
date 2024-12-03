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
        
        // Load checked items and custom ingredients
        const listRef = doc(db, "users", userId, "shoppingLists", "current");
        const listDoc = await getDoc(listRef);
        
        if (listDoc.exists()) {
          const data = listDoc.data();
          setCheckedItems(new Set(data.checkedItems || []));
          console.log("Loaded checked items:", data.checkedItems);
          console.log("Loaded custom ingredients:", data.ingredients);
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
      const customIngredients = ingredients.filter(ing => ing.recipeId === 'custom');
      console.log("Saving checked items and custom ingredients:", {
        checkedItems: Array.from(newChecked),
        customIngredients
      });

      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      
      // Save both checked items and custom ingredients
      await setDoc(listRef, {
        checkedItems: Array.from(newChecked),
        ingredients: customIngredients,
        updatedAt: new Date()
      }, { merge: true });

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