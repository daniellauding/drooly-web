import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { IngredientItem } from '@/components/shopping/types';
import { useToast } from '@/hooks/use-toast';

export function useIngredientOperations(userId: string | undefined) {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const { toast } = useToast();

  const handleUpdateIngredient = async (ingredient: IngredientItem, updates: Partial<IngredientItem>) => {
    if (!userId) {
      console.log("Cannot update ingredient: No user ID");
      return;
    }

    try {
      console.log("Updating ingredient:", { ingredient, updates });
      
      setIngredients(prev => prev.map(ing => 
        (ing.recipeId === ingredient.recipeId && ing.name === ingredient.name)
          ? { ...ing, ...updates }
          : ing
      ));

      if (ingredient.recipeId === 'custom') {
        const listRef = doc(db, "users", userId, "shoppingLists", "current");
        const listDoc = await getDoc(listRef);
        
        if (listDoc.exists()) {
          const currentData = listDoc.data();
          const updatedIngredients = (currentData.ingredients || []).map((ing: IngredientItem) =>
            (ing.name === ingredient.name)
              ? { ...ing, ...updates }
              : ing
          );
          
          await updateDoc(listRef, {
            ingredients: updatedIngredients,
            updatedAt: Timestamp.now()
          });
        }
      }

      toast({
        title: "Success",
        description: "Ingredient updated successfully"
      });
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to update ingredient",
        variant: "destructive"
      });
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
    
    console.log("Adding custom ingredient:", customIngredient);
    setIngredients(prev => [...prev, customIngredient]);
  };

  return {
    ingredients,
    setIngredients,
    handleUpdateIngredient,
    addCustomIngredient
  };
}