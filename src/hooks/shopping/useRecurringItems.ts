import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { IngredientItem } from '@/components/shopping/types';

export function useRecurringItems(userId: string | undefined) {
  const { toast } = useToast();

  const setRecurring = async (ingredient: IngredientItem, recurrence: "none" | "weekly" | "monthly") => {
    if (!userId) return;
    
    try {
      console.log("Setting recurring status for ingredient:", ingredient.name, "to", recurrence);
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
        checkedItems: listDoc.exists() ? listDoc.data().checkedItems || [] : [],
        updatedAt: Timestamp.now(),
        recurringItems
      }, { merge: true });

      toast({
        title: "Updated",
        description: `Item set to ${recurrence} recurring`,
      });
    } catch (error) {
      console.error("Error updating recurring items:", error);
      toast({
        title: "Error",
        description: "Failed to update recurring items",
        variant: "destructive"
      });
    }
  };

  return { setRecurring };
}