import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COMMON_INGREDIENTS } from "./CommonIngredients";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface IngredientSuggestionsProps {
  onSelect: (ingredient: string) => void;
  onClose: () => void;
}

export function IngredientSuggestions({ onSelect, onClose }: IngredientSuggestionsProps) {
  const [searchValue, setSearchValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAddCustom = () => {
    if (searchValue.trim()) {
      onSelect(searchValue.trim());
      setSearchValue("");
    }
  };

  return (
    <div ref={ref}>
      <Command className="border rounded-lg bg-popover shadow-md">
        <CommandInput 
          placeholder="Search common ingredients..." 
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList className="max-h-[300px]">
          <CommandEmpty className="p-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No ingredients found.</p>
              {searchValue.trim() && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleAddCustom}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{searchValue}" as custom ingredient
                </Button>
              )}
            </div>
          </CommandEmpty>
          {Object.entries(COMMON_INGREDIENTS).map(([category, ingredients]) => (
            <CommandGroup key={category} heading={category}>
              {ingredients.map((ingredient) => (
                <CommandItem
                  key={ingredient}
                  value={ingredient}
                  onSelect={() => {
                    onSelect(ingredient);
                    setSearchValue("");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {ingredient}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}