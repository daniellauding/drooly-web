import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Check, ChevronDown } from "lucide-react";
import { CustomIngredientAdd } from "@/components/shopping/CustomIngredientAdd";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const markAllInRecipeAsBought = async (recipeId: string) => {
    if (!user) return;

    const recipeIngredients = ingredients.filter(ing => ing.recipeId === recipeId);
    const newChecked = new Set(checkedItems);
    
    recipeIngredients.forEach(ing => {
      newChecked.add(`${ing.recipeId}-${ing.name}`);
    });

    setCheckedItems(newChecked);
    await saveCheckedItems(newChecked);

    toast({
      title: "Success",
      description: "All ingredients marked as bought"
    });
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
          <AccordionItem key={recipe.id} value={recipe.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{recipe.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllInRecipeAsBought(recipe.id);
                  }}
                  className="ml-4"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Bought
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {ingredients
                .filter(ing => ing.recipeId === recipe.id)
                .map((ingredient, idx) => (
                  <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
                    <div className="flex items-center gap-4 py-2">
                      <Checkbox
                        checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                        onCheckedChange={() => handleCheck(ingredient)}
                      />
                      <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    </div>
                    {idx < ingredients.filter(ing => ing.recipeId === recipe.id).length - 1 && <Separator />}
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}

        {ingredients.some(ing => ing.recipeId === 'custom') && (
          <AccordionItem value="custom" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              Custom Items
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {ingredients
                .filter(ing => ing.recipeId === 'custom')
                .map((ingredient, idx) => (
                  <div key={`custom-${ingredient.name}-${idx}`}>
                    <div className="flex items-center gap-4 py-2">
                      <Checkbox
                        checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                        onCheckedChange={() => handleCheck(ingredient)}
                      />
                      <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    </div>
                    {idx < ingredients.filter(ing => ing.recipeId === 'custom').length - 1 && <Separator />}
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
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