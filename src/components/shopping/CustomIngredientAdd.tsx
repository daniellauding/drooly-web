import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IngredientSuggestions } from "../ingredients/IngredientSuggestions";

interface CustomIngredientAddProps {
  onAdd: (name: string, amount: string, unit: string) => void;
}

export function CustomIngredientAdd({ onAdd }: CustomIngredientAddProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");

  const handleIngredientSelect = (name: string) => {
    if (amount.trim()) {
      onAdd(name, amount, unit);
      setAmount("");
      setUnit("piece");
    }
    setShowSuggestions(false);
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-medium mb-2">Add Custom Ingredient</h3>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div
            onClick={() => setShowSuggestions(true)}
            className="cursor-pointer"
          >
            <Input
              placeholder="Search or add ingredient..."
              readOnly
            />
          </div>
          {showSuggestions && (
            <div className="absolute w-full z-50 mt-1">
              <IngredientSuggestions
                onSelect={handleIngredientSelect}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
          )}
        </div>
        <Input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24"
        />
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece"].map(unit => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}