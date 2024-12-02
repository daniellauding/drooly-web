import { useState, useEffect } from "react";
import { Command } from "@/components/ui/command";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface RecipeSearchAutocompleteProps {
  onSelect: (recipe: Recipe | string) => void;
  value: string;
  onChange: (value: string) => void;
}

export function RecipeSearchAutocomplete({ onSelect, value, onChange }: RecipeSearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        console.log('Fetching recipe suggestions');
        const recipesRef = collection(db, "recipes");
        const q = query(recipesRef);
        const querySnapshot = await getDocs(q);
        
        const recipes = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Recipe[];
        
        const filteredRecipes = value
          ? recipes.filter(recipe => 
              recipe.title.toLowerCase().includes(value.toLowerCase())
            )
          : recipes;

        console.log('Found recipes:', filteredRecipes.length);
        setSuggestions(filteredRecipes);
      } catch (error) {
        console.error("Error fetching recipe suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [value]);

  const handleSelect = (recipe: Recipe) => {
    console.log('Selected recipe:', recipe);
    onSelect(recipe);
    onChange("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a recipe"
          className="w-full"
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          {suggestions.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => handleSelect(recipe)}
            >
              <Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
              <div>
                <p>{recipe.title}</p>
                <p className="text-sm text-muted-foreground">
                  by {recipe.creatorName || 'Anonymous'}
                </p>
              </div>
            </div>
          ))}
          {value && !suggestions.find(r => r.title.toLowerCase() === value.toLowerCase()) && (
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer border-t"
            >
              <Plus className="h-4 w-4" />
              <div>
                <p>Create new recipe</p>
                <p className="text-sm text-muted-foreground">Add "{value}" as a new recipe</p>
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}