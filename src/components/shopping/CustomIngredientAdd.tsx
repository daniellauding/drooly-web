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
import { useToast } from "@/hooks/use-toast";

interface CustomIngredientAddProps {
  onAdd: (name: string, amount: string, unit: string) => void;
}

export function CustomIngredientAdd({ onAdd }: CustomIngredientAddProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an ingredient name",
        variant: "destructive"
      });
      return;
    }

    if (!amount.trim()) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }

    onAdd(name.trim(), amount.trim(), unit);
    setName("");
    setAmount("");
    setUnit("piece");

    toast({
      title: "Success",
      description: "Custom ingredient added to your list"
    });
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-medium mb-4">Add Custom Ingredient</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Ingredient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
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
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
    </Card>
  );
}