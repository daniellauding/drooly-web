import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecurrenceSelect } from "./RecurrenceSelect";

interface IngredientFormProps {
  amount: string;
  unit: string;
  recurrence: "none" | "weekly" | "monthly";
  onAmountChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onRecurrenceChange: (value: "none" | "weekly" | "monthly") => void;
  onAdd: () => void;
  disabled?: boolean;
}

export function IngredientForm({
  amount,
  unit,
  recurrence,
  onAmountChange,
  onUnitChange,
  onRecurrenceChange,
  onAdd,
  disabled
}: IngredientFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-24"
        />
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece"].map(unit => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onAdd}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <RecurrenceSelect 
        value={recurrence}
        onChange={onRecurrenceChange}
      />
    </div>
  );
}