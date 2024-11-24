import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { useState } from "react";

interface AdvancedIngredientSectionProps {
  onAddIngredient: (name: string, group: string) => void;
  groups: string[];
}

export function AdvancedIngredientSection({ onAddIngredient, groups }: AdvancedIngredientSectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium">Custom Ingredient Groups</h3>
      
      <div className="relative">
        <div
          className={`w-full border rounded-md p-2 flex items-center justify-between cursor-pointer ${!showSuggestions ? 'hover:bg-accent hover:text-accent-foreground' : ''}`}
          onClick={() => !showSuggestions && setShowSuggestions(true)}
        >
          <span className="text-muted-foreground">Search or add ingredients...</span>
        </div>

        {showSuggestions && (
          <div className="absolute w-full z-50">
            <IngredientSuggestions 
              onSelect={(ingredientName) => {
                setShowSuggestions(false);
                // Show group selection after ingredient is selected
                const defaultGroup = groups[0] || "Main Ingredients";
                onAddIngredient(ingredientName, defaultGroup);
              }}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}
      </div>

      <Select
        value=""
        onValueChange={(group) => onAddIngredient("", group)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select ingredient group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map(group => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}