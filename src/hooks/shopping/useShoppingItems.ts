import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { IngredientItem } from '@/components/shopping/types';

export function useShoppingItems(userId: string | undefined) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to useShoppingItems");
      return;
    }
    loadCheckedItems();
  }, [userId]);

  const loadCheckedItems = async () => {
    if (!userId) return;
    
    try {
      console.log("Loading checked items for user:", userId);
      const listRef = doc(db, "users", userId, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      
      if (listDoc.exists()) {
        console.log("Found existing checked items:", listDoc.data().checkedItems);
        setCheckedItems(new Set(listDoc.data().checkedItems || []));
      } else {
        console.log("No existing checked items found, creating new document");
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
        description: "Failed to load your checked items. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const saveCheckedItems = async (items: Set<string>, ingredients: IngredientItem[]) => {
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

  return {
    checkedItems,
    setCheckedItems,
    saveCheckedItems,
    loadCheckedItems
  };
}