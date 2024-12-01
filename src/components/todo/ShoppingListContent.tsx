import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import { RecipeAccordionItem } from "./RecipeAccordionItem";
import { CustomIngredientsAccordion } from "./CustomIngredientsAccordion";
import { useShoppingList } from "@/hooks/useShoppingList";

export function ShoppingListContent() {
  const { user } = useAuth();
  const { 
    recipes,
    ingredients,
    checkedItems,
    handleCheck,
    handleCheckAll,
    handleRemoveIngredient,
    addCustomIngredient,
    setRecurring
  } = useShoppingList(user?.uid);

  return (
    <div className="space-y-6">
      <CustomIngredientAdd onAdd={addCustomIngredient} />

      <Accordion type="single" collapsible className="w-full space-y-4">
        {recipes.map(recipe => (
          <RecipeAccordionItem
            key={recipe.id}
            recipeId={recipe.id}
            recipeTitle={recipe.title}
            ingredients={ingredients.filter(ing => ing.recipeId === recipe.id)}
            checkedItems={checkedItems}
            onCheck={handleCheck}
            onCheckAll={handleCheckAll}
            onRemove={handleRemoveIngredient}
          />
        ))}

        {ingredients.some(ing => ing.recipeId === 'custom') && (
          <CustomIngredientsAccordion
            ingredients={ingredients.filter(ing => ing.recipeId === 'custom')}
            checkedItems={checkedItems}
            onCheck={handleCheck}
            onCheckAll={handleCheckAll}
          />
        )}
      </Accordion>

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