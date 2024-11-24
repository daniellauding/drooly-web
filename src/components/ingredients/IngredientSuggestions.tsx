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
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim() && !Object.values(COMMON_INGREDIENTS).flat().includes(searchValue.trim())) {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div ref={ref}>
      <Command className="border rounded-lg bg-popover shadow-md">
        <CommandInput 
          ref={inputRef}
          placeholder="Search ingredients or type to add custom..." 
          value={searchValue}
          onValueChange={setSearchValue}
          onKeyDown={handleKeyDown}
          className="h-10"
        />
        <CommandList className="max-h-[300px]">
          <CommandEmpty className="p-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No ingredients found.</p>
              {searchValue.trim() && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full h-9"
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
              {ingredients
                .filter(ingredient => 
                  ingredient.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((ingredient) => (
                  <CommandItem
                    key={ingredient}
                    value={ingredient}
                    onSelect={() => {
                      onSelect(ingredient);
                      setSearchValue("");
                    }}
                    className="h-9"
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