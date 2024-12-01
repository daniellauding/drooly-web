import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientSuggestions } from "../ingredients/IngredientSuggestions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CustomIngredientAddProps {
  onAdd: (name: string, amount: string, unit: string) => void;
}

export function CustomIngredientAdd({ onAdd }: CustomIngredientAddProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");

  const handleIngredientSelect = (name: string) => {
    setSelectedIngredient(name);
    setShowSuggestions(false);
    setShowAmountDialog(true);
  };

  const handleAddIngredient = () => {
    if (amount.trim() && selectedIngredient) {
      onAdd(selectedIngredient, amount, unit);
      setAmount("");
      setUnit("piece");
      setSelectedIngredient("");
      setShowAmountDialog(false);
    }
  };

  return (
    <>
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
                value={selectedIngredient}
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
        </div>
      </Card>

      <Dialog open={showAmountDialog} onOpenChange={setShowAmountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedIngredient}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
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
            <Button onClick={handleAddIngredient} className="w-full">
              Add to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}