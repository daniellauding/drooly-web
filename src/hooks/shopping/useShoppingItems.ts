import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';

export function useShoppingItems(userId: string | undefined) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [customIngredients, setCustomIngredients] = useState<IngredientItem[]>([]);
  const { toast } = useToast();

  // Load checked items and custom ingredients on mount
  useEffect(() => {
    const loadItems = async () => {
      if (!userId) return;

      try {
        console.log("Loading checked items and custom ingredients for user:", userId);
        const listRef = doc(db, "users", userId, "shoppingLists", "current");
        const listDoc = await getDoc(listRef);
        
        if (listDoc.exists()) {
          const data = listDoc.data();
          setCheckedItems(new Set(data.checkedItems || []));
          
          // Load custom ingredients
          const savedIngredients = data.ingredients || [];
          console.log("Loaded custom ingredients from Firestore:", savedIngredients);
          setCustomIngredients(savedIngredients);
        }
      } catch (error) {
        console.error("Error loading checked items and custom ingredients:", error);
        toast({
          title: "Error",
          description: "Failed to load your shopping list",
          variant: "destructive"
        });
      }
    };

    loadItems();
  }, [userId, toast]);

  const saveCheckedItems = async (newChecked: Set<string>, ingredients: IngredientItem[]) => {
    if (!userId) return;

    try {
      const customIngs = ingredients.filter(ing => ing.recipeId === 'custom');
      console.log("Saving custom ingredients to Firestore:", customIngs);

      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      await setDoc(listRef, {
        checkedItems: Array.from(newChecked),
        ingredients: customIngs,
        updatedAt: new Date()
      }, { merge: true });

      // Update local state
      setCustomIngredients(customIngs);

    } catch (error) {
      console.error("Error saving checked items and custom ingredients:", error);
      toast({
        title: "Error",
        description: "Failed to save your shopping list",
        variant: "destructive"
      });
    }
  };

  return {
    checkedItems,
    setCheckedItems,
    saveCheckedItems,
    customIngredients
  };
}