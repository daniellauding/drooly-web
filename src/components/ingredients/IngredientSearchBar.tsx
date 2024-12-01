import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";

interface IngredientSearchBarProps {
  onIngredientAdd: (name: string) => void;
}

export function IngredientSearchBar({ onIngredientAdd }: IngredientSearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customIngredientInput, setCustomIngredientInput] = useState("");

  const handleCustomIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customIngredientInput.trim()) {
      e.preventDefault();
      onIngredientAdd(customIngredientInput.trim());
      setCustomIngredientInput("");
    }
  };

  return (
    <div className="relative">
      <Input
        value={customIngredientInput}
        onChange={(e) => setCustomIngredientInput(e.target.value)}
        onKeyDown={handleCustomIngredientKeyDown}
        onClick={() => !showSuggestions && setShowSuggestions(true)}
        placeholder="Search or add ingredients..."
        className="cursor-pointer"
      />

      {showSuggestions && (
        <div className="absolute w-full z-50 mt-1">
          <IngredientSuggestions 
            onSelect={(ingredientName) => {
              onIngredientAdd(ingredientName);
              setShowSuggestions(false);
              setCustomIngredientInput("");
            }}
            onClose={() => setShowSuggestions(false)}
            initialValue={customIngredientInput}
          />
        </div>
      )}
    </div>
  );
}