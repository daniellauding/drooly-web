import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { IngredientSearchBar } from "./IngredientSearchBar";
import { IngredientForm } from "../shopping/IngredientForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IngredientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onIngredientAdd: (name: string, group?: string) => void;
  group?: string;
}

export function IngredientFormDialog({ 
  open, 
  onClose, 
  onIngredientAdd,
  group 
}: IngredientFormDialogProps) {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");
  const [recurrence, setRecurrence] = useState<"none" | "weekly" | "monthly">("none");
  const { t } = useTranslation();

  const handleAdd = () => {
    if (selectedIngredient) {
      onIngredientAdd(selectedIngredient, group);
      setSelectedIngredient("");
      setAmount("");
      setUnit("piece");
      setRecurrence("none");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t('recipe.ingredients.addCustom')}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <IngredientSearchBar 
            onIngredientAdd={(name) => setSelectedIngredient(name)}
          />
          
          <IngredientForm
            amount={amount}
            unit={unit}
            recurrence={recurrence}
            onAmountChange={setAmount}
            onUnitChange={setUnit}
            onRecurrenceChange={setRecurrence}
            onAdd={handleAdd}
            disabled={!selectedIngredient}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}