import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IngredientItem } from "./types";
import { useState } from "react";

interface EditIngredientModalProps {
  ingredient: IngredientItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (ingredient: IngredientItem, updates: Partial<IngredientItem>) => void;
}

export function EditIngredientModal({ ingredient, open, onClose, onSave }: EditIngredientModalProps) {
  const [editAmount, setEditAmount] = useState(ingredient?.amount || "");
  const [editUnit, setEditUnit] = useState(ingredient?.unit || "");

  const handleSave = () => {
    if (!ingredient) return;
    onSave(ingredient, {
      amount: editAmount,
      unit: editUnit
    });
    onClose();
  };

  // Reset form when modal opens with new ingredient
  useState(() => {
    if (ingredient) {
      setEditAmount(ingredient.amount);
      setEditUnit(ingredient.unit);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ingredient: {ingredient?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              placeholder="Amount"
              className="w-24"
            />
            <Select value={editUnit} onValueChange={setEditUnit}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece"].map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}