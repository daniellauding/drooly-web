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
import { Trash2 } from "lucide-react";

interface AdvancedIngredientSectionProps {
  onAddIngredient: (name: string, group: string) => void;
  onRemoveGroup: (group: string) => void;
  groups: string[];
}

export function AdvancedIngredientSection({ 
  onAddIngredient, 
  onRemoveGroup,
  groups 
}: AdvancedIngredientSectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium text-sm">Custom Ingredient Groups</h3>
      
      <div className="relative">
        <div
          className={`w-full h-10 border rounded-md px-3 flex items-center justify-between cursor-pointer text-sm ${
            !showSuggestions ? 'hover:bg-accent hover:text-accent-foreground' : ''
          }`}
          onClick={() => !showSuggestions && setShowSuggestions(true)}
        >
          <span className="text-muted-foreground">Search or add ingredients...</span>
        </div>

        {showSuggestions && (
          <div className="absolute w-full z-50 mt-1">
            <IngredientSuggestions 
              onSelect={(ingredientName) => {
                setShowSuggestions(false);
                const defaultGroup = groups[0] || "Main Ingredients";
                onAddIngredient(ingredientName, defaultGroup);
              }}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {groups.map(group => (
          <div key={group} className="flex items-center justify-between">
            <Select
              value=""
              onValueChange={(group) => onAddIngredient("", group)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={group} />
              </SelectTrigger>
              <SelectContent>
                {groups.map(g => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveGroup(group)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}