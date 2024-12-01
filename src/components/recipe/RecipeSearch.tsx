import { useState } from "react";
import { collection, query as firestoreQuery, where, getDocs } from "firebase/firestore";
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

  const searchRecipes = async (searchTerm: string) => {
    if (!searchTerm?.trim() || !userId) {
      setRecipes([]);
      return;
    }
    
    try {
      console.log("Searching recipes with query:", searchTerm);
      const recipesRef = collection(db, "recipes");
      const searchQueryRef = firestoreQuery(
        recipesRef,
        where("title", ">=", searchTerm.toLowerCase()),
        where("title", "<=", searchTerm.toLowerCase() + "\uf8ff")
      );
      
      const querySnapshot = await getDocs(searchQueryRef);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      
      console.log("Found recipes:", results.length);
      setRecipes(results || []);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setRecipes([]);
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
      <CommandGroup className="max-h-[200px] overflow-auto">
        {recipes?.map((recipe) => (
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
    </Command>
  );
}