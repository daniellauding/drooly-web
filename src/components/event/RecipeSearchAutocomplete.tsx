import { useState, useEffect } from "react";
import { Command } from "@/components/ui/command";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@/types/recipe";

interface RecipeSearchAutocompleteProps {
  onSelect: (recipe: Recipe | string) => void;
  value: string;
  onChange: (value: string) => void;
}

export function RecipeSearchAutocomplete({ onSelect, value, onChange }: RecipeSearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const recipesRef = collection(db, "recipes");
        const q = query(
          recipesRef,
          where("title", ">=", value),
          where("title", "<=", value + "\uf8ff")
        );
        
        const querySnapshot = await getDocs(q);
        const recipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Recipe[];
        
        setSuggestions(recipes);
      } catch (error) {
        console.error("Error fetching recipe suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [value]);

  const handleSelect = (recipe: Recipe | string) => {
    onSelect(recipe);
    onChange("");
    setOpen(false);
  };

  const handleCreateNew = () => {
    navigate("/create-recipe");
  };

  return (
    <Popover open={open && (suggestions.length > 0 || value.length > 0)} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a recipe"
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter" && value) {
              e.preventDefault();
              handleSelect(value);
            }
          }}
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
          {value && !suggestions.find(r => r.title === value) && (
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer border-t"
              onClick={handleCreateNew}
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