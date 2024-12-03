import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import { RecipeAccordionItem } from "../todo/RecipeAccordionItem";
import { CustomIngredientsAccordion } from "../todo/CustomIngredientsAccordion";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ShoppingListView } from "./ShoppingListView";

export function ShoppingListContent() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "recipe">("list");
  const { 
    recipes,
    ingredients,
    checkedItems,
    handleCheck,
    handleCheckAll,
    handleRemoveIngredient,
    handleUpdateIngredient,
    addCustomIngredient,
    setRecurring
  } = useShoppingList(user?.uid);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">View Mode</h3>
          <Select 
            value={viewMode} 
            onValueChange={(value: "list" | "recipe") => setViewMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Ingredients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">All Ingredients</SelectItem>
              <SelectItem value="recipe">Group by Recipe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {viewMode === "list" && (
        <CustomIngredientAdd onAdd={addCustomIngredient} />
      )}

      <ShoppingListView
        recipes={recipes}
        ingredients={ingredients}
        checkedItems={checkedItems}
        onCheck={handleCheck}
        onRemove={handleRemoveIngredient}
        onUpdate={handleUpdateIngredient}
        viewMode={viewMode}
      />

      <div className="mt-8">
        <ShoppingHistory 
          userId={user?.uid || ""} 
          onAddToList={(items) => items.forEach(item => addCustomIngredient(item.name, item.amount, item.unit))}
          onSetRecurring={setRecurring}
        />
      </div>
    </div>
  );
}