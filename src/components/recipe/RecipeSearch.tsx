import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeSearchProps {
  userId: string;
  onRecipeSelect: (recipe: Recipe) => void;
  selectedRecipe: Recipe | null;
}

export function RecipeSearch({ userId, onRecipeSelect, selectedRecipe }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const searchRecipes = async (query: string) => {
    if (!query || !query.trim() || !userId) return;
    
    try {
      console.log("Searching recipes with query:", query);
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("title", ">=", query.toLowerCase()),
        where("title", "<=", query.toLowerCase() + "\uf8ff")
      );
      
      const querySnapshot = await getDocs(q);
      const results: Recipe[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Recipe;
        results.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log("Found recipes:", results.length);
      setRecipes(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search recipes..." 
        value={searchQuery}
        onValueChange={(value) => {
          setSearchQuery(value);
          searchRecipes(value);
        }}
      />
      <CommandEmpty>No recipes found.</CommandEmpty>
      {recipes.length > 0 && (
        <CommandGroup className="max-h-[200px] overflow-auto">
          {recipes.map((recipe) => (
            <CommandItem
              key={recipe.id}
              value={recipe.title}
              onSelect={() => {
                onRecipeSelect(recipe);
                setSearchQuery("");
                setRecipes([]);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedRecipe?.id === recipe.id ? "opacity-100" : "opacity-0"
                )}
              />
              {recipe.title}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  );
}