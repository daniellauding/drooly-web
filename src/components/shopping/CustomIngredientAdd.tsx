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
import { IngredientSuggestions } from "../ingredients/IngredientSuggestions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, addDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface CustomIngredientAddProps {
  onAdd: (name: string, amount: string, unit: string, recurrence?: "none" | "weekly" | "monthly") => void;
}

export function CustomIngredientAdd({ onAdd }: CustomIngredientAddProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("piece");
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [recurrence, setRecurrence] = useState<"none" | "weekly" | "monthly">("none");
  const { toast } = useToast();
  const { user } = useAuth();

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

    setShowRecurrenceDialog(true);
  };

  const handleConfirmAdd = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add ingredients",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Adding custom ingredient:", { name, amount, unit, recurrence });
      
      // First, get the current shopping list
      const listRef = doc(db, "users", user.uid, "shoppingLists", "current");
      const listDoc = await getDoc(listRef);
      
      // Prepare the new ingredient
      const newIngredient = {
        name: name.trim(),
        amount: amount.trim(),
        unit,
        recipeId: 'custom',
        recipeTitle: 'Custom Items',
        bought: false,
        recurrence
      };

      if (listDoc.exists()) {
        // Update existing list
        const currentData = listDoc.data();
        const ingredients = currentData.ingredients || [];
        
        await updateDoc(listRef, {
          ingredients: [...ingredients, newIngredient],
          updatedAt: new Date()
        });
      } else {
        // Create new list
        await setDoc(listRef, {
          ingredients: [newIngredient],
          checkedItems: [],
          updatedAt: new Date()
        });
      }

      // Call the onAdd callback
      onAdd(name.trim(), amount.trim(), unit, recurrence);

      // Reset form
      setName("");
      setAmount("");
      setUnit("piece");
      setRecurrence("none");
      setShowRecurrenceDialog(false);

      toast({
        title: "Success",
        description: `Custom ingredient added to your list${recurrence !== "none" ? ` (${recurrence} recurring)` : ""}`
      });
    } catch (error) {
      console.error("Error saving custom ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to save custom ingredient",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-medium mb-4">Add Custom Ingredient</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div
            className={`w-full h-10 border rounded-md px-3 flex items-center justify-between cursor-pointer text-sm ${
              !showSuggestions ? 'hover:bg-accent hover:text-accent-foreground' : ''
            }`}
            onClick={() => !showSuggestions && setShowSuggestions(true)}
          >
            <span className={name ? 'text-foreground' : 'text-muted-foreground'}>
              {name || 'Search or add ingredient...'}
            </span>
          </div>

          {showSuggestions && (
            <div className="absolute w-full z-50 mt-1">
              <IngredientSuggestions 
                onSelect={(ingredientName) => {
                  setName(ingredientName);
                  setShowSuggestions(false);
                }}
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
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <Dialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Recurrence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>How often do you want to buy this ingredient?</Label>
            <RadioGroup value={recurrence} onValueChange={(value: "none" | "weekly" | "monthly") => setRecurrence(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">One time only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
            </RadioGroup>
            <Button onClick={handleConfirmAdd} className="w-full">
              Add to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}