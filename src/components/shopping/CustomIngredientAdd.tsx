import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { IngredientForm } from "./IngredientForm";
import { IngredientSuggestions } from "../ingredients/IngredientSuggestions";

interface CustomIngredientAddProps {
  onAdd: (name: string, amount: string, unit: string, recurrence?: "none" | "weekly" | "monthly") => void;
}

export function CustomIngredientAdd({ onAdd }: CustomIngredientAddProps) {
  const { t } = useTranslation();
  const [customIngredientInput, setCustomIngredientInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");
  const [recurrence, setRecurrence] = useState<"none" | "weekly" | "monthly">("none");

  const handleCustomIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customIngredientInput.trim()) {
      e.preventDefault();
      handleAddCustomIngredient();
    }
  };

  const handleAddCustomIngredient = () => {
    if (customIngredientInput.trim()) {
      onAdd(customIngredientInput.trim(), amount, unit, recurrence);
      setCustomIngredientInput("");
      setAmount("");
      setUnit("piece");
      setRecurrence("none");
      setShowSuggestions(false);
    }
  };

  console.log("Rendering CustomIngredientAdd with input:", customIngredientInput);

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">{t('recipe.ingredients.addCustom')}</h3>
      <div className="space-y-4">
        <div className="relative">
          <Input
            value={customIngredientInput}
            onChange={(e) => setCustomIngredientInput(e.target.value)}
            onKeyDown={handleCustomIngredientKeyDown}
            onClick={() => !showSuggestions && setShowSuggestions(true)}
            placeholder={t('recipe.ingredients.searchOrAdd')}
            className="w-full"
          />

          {showSuggestions && (
            <div className="absolute w-full z-50 mt-1">
              <IngredientSuggestions 
                onSelect={(ingredientName) => {
                  setCustomIngredientInput(ingredientName);
                  setShowSuggestions(false);
                }}
                onClose={() => setShowSuggestions(false)}
                initialValue={customIngredientInput}
              />
            </div>
          )}
        </div>

        <IngredientForm
          amount={amount}
          unit={unit}
          recurrence={recurrence}
          onAmountChange={setAmount}
          onUnitChange={setUnit}
          onRecurrenceChange={setRecurrence}
          onAdd={handleAddCustomIngredient}
          disabled={!customIngredientInput.trim()}
        />
      </div>
    </Card>
  );
}