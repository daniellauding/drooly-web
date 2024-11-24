import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COMMON_INGREDIENTS } from "./CommonIngredients";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IngredientSuggestionsProps {
  onSelect: (ingredient: string) => void;
}

export function IngredientSuggestions({ onSelect }: IngredientSuggestionsProps) {
  return (
    <Command className="border rounded-lg">
      <CommandInput placeholder="Search common ingredients..." />
      <CommandList className="max-h-[300px]">
        <CommandEmpty>No ingredients found.</CommandEmpty>
        {Object.entries(COMMON_INGREDIENTS).map(([category, ingredients]) => (
          <CommandGroup key={category} heading={category}>
            {ingredients.map((ingredient) => (
              <CommandItem
                key={ingredient}
                value={ingredient}
                onSelect={() => onSelect(ingredient)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {ingredient}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}