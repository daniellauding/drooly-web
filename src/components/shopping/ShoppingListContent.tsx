import { useShoppingListState } from "./hooks/useShoppingListState";
import { useShoppingItems } from "@/hooks/shopping/useShoppingItems";
import { useRecurringItems } from "@/hooks/shopping/useRecurringItems";
import { ShoppingListHeader } from "./ShoppingListHeader";
import { CustomIngredientAdd } from "./CustomIngredientAdd";
import { ShoppingListView } from "./ShoppingListView";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IngredientItem } from "./types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShoppingListContentProps {
  userId: string | undefined;
  listId: string;
}

export function ShoppingListContent({ userId, listId }: ShoppingListContentProps) {
  const { recipes, ingredients, setIngredients } = useShoppingListState(userId);
  const { checkedItems, setCheckedItems, saveCheckedItems } = useShoppingItems(userId);
  const { setRecurring } = useRecurringItems(userId);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "recipe">("list");

  console.log("ShoppingListContent - Current view mode:", viewMode);
  console.log("ShoppingListContent - Number of recipes:", recipes.length);
  console.log("ShoppingListContent - Number of ingredients:", ingredients.length);

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

  const clearChecked = async () => {
    if (!userId) return;
    const newChecked = new Set<string>();
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked, ingredients);
    toast({
      title: "Shopping list cleared",
      description: "All items have been unchecked"
    });
  };

  const markAllAsBought = async () => {
    if (!userId) return;
    const allKeys = ingredients.map(ing => `${ing.recipeId}-${ing.name}`);
    const newChecked = new Set(allKeys);
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked, ingredients);
    toast({
      title: "All items marked as bought",
      description: "Your shopping list has been completed"
    });
  };

  const handleAddCustomIngredient = async (name: string, amount: string, unit: string) => {
    const customIngredient: IngredientItem = {
      name,
      amount,
      unit,
      recipeId: 'custom',
      recipeTitle: 'Other Items',
      bought: false
    };
    setIngredients(prev => [...prev, customIngredient]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Select 
          value={viewMode} 
          onValueChange={(value: "list" | "recipe") => {
            console.log("Changing view mode to:", value);
            setViewMode(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">All Ingredients</SelectItem>
            <SelectItem value="recipe">Group by Recipe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ShoppingListHeader
        checkedItemsCount={checkedItems.size}
        onClearAll={clearChecked}
        onMarkAllBought={markAllAsBought}
        userId={userId || ""}
        listId={listId}
      />

      <CustomIngredientAdd onAdd={handleAddCustomIngredient} />

      <ShoppingListView
        recipes={recipes}
        ingredients={ingredients}
        checkedItems={checkedItems}
        onCheck={handleCheck}
        viewMode={viewMode}
      />
    </div>
  );
}