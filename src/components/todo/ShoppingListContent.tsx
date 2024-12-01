import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { useToast } from "@/hooks/use-toast";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import { RecipeAccordionItem } from "./RecipeAccordionItem";
import { CustomIngredientsAccordion } from "./CustomIngredientsAccordion";

export function ShoppingListContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadCheckedItems();
      loadShoppingList();
    }
  }, [user]);

  const loadCheckedItems = async () => {
    if (!user) return;
    try {
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        setCheckedItems(new Set(listDoc.data().checkedItems || []));
      }
    } catch (error) {
      console.error("Error loading checked items:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list",
        variant: "destructive"
      });
    }
  };

  const loadShoppingList = async () => {
    if (!user) return;
    try {
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];

      setRecipes(fetchedRecipes);

      const allIngredients = fetchedRecipes.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          bought: false
        }))
      );

      setIngredients(allIngredients);
    } catch (error) {
      console.error("Error loading shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping list",
        variant: "destructive"
      });
    }
  };

  const handleCheck = async (ingredient: IngredientItem) => {
    if (!user) return;

    const key = `${ingredient.recipeId}-${ingredient.name}`;
    const newChecked = new Set(checkedItems);
    
    if (!checkedItems.has(key)) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    
    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
  };

  const handleCheckAll = async (ingredients: IngredientItem[]) => {
    if (!user) return;

    const newChecked = new Set(checkedItems);
    const allChecked = ingredients.every(ing => 
      checkedItems.has(`${ing.recipeId}-${ing.name}`)
    );
    
    ingredients.forEach(ing => {
      const key = `${ing.recipeId}-${ing.name}`;
      if (allChecked) {
        newChecked.delete(key);
      } else {
        newChecked.add(key);
      }
    });

    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);
  };

  const handleRemoveIngredient = (ingredient: IngredientItem) => {
    setIngredients(prev => prev.filter(ing => 
      !(ing.recipeId === ingredient.recipeId && ing.name === ingredient.name)
    ));
  };

  const saveCheckedItems = async (items: Set<string>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "shoppingLists", "current"), {
        checkedItems: Array.from(items),
        updatedAt: Timestamp.now()
      });

      if (items.size > 0) {
        const checkedIngredients = ingredients.filter(ing => 
          items.has(`${ing.recipeId}-${ing.name}`)
        );
        
        await addDoc(collection(db, "users", user.uid, "shoppingHistory"), {
          items: checkedIngredients,
          checkedAt: Timestamp.now(),
          recurrence: "none"
        });
      }
    } catch (error) {
      console.error("Error saving checked items:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomIngredient = (name: string, amount: string, unit: string) => {
    const customIngredient: IngredientItem = {
      name,
      amount,
      unit,
      recipeId: 'custom',
      recipeTitle: 'Custom Items',
      bought: false
    };
    setIngredients(prev => [...prev, customIngredient]);
  };

  const addHistoryItemsToList = (items: IngredientItem[]) => {
    setIngredients(prev => [...prev, ...items]);
  };

  return (
    <div className="space-y-6">
      <CustomIngredientAdd onAdd={handleAddCustomIngredient} />

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
          onAddToList={addHistoryItemsToList}
        />
      </div>
    </div>
  );
}