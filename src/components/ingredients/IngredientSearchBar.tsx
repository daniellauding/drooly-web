import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IngredientSearchBarProps {
  onIngredientAdd: (name: string, group?: string) => void;
}

export function IngredientSearchBar({ onIngredientAdd }: IngredientSearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customIngredientInput, setCustomIngredientInput] = useState("");
  const { t } = useTranslation();

  const handleCustomIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customIngredientInput.trim()) {
      e.preventDefault();
      onIngredientAdd(customIngredientInput.trim());
      setCustomIngredientInput("");
      setShowSuggestions(false);
    }
  };

  const handleAddCustomIngredient = () => {
    if (customIngredientInput.trim()) {
      onIngredientAdd(customIngredientInput.trim());
      setCustomIngredientInput("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          value={customIngredientInput}
          onChange={(e) => setCustomIngredientInput(e.target.value)}
          onKeyDown={handleCustomIngredientKeyDown}
          onClick={() => !showSuggestions && setShowSuggestions(true)}
          placeholder={t('recipe.ingredients.searchOrAdd')}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleAddCustomIngredient}
          disabled={!customIngredientInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

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