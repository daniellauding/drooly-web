import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { IngredientSuggestions } from "./IngredientSuggestions";
import { Ingredient } from "@/services/recipeService";
import { IngredientFormDialog } from "./IngredientFormDialog";
import { DeleteConfirmationDialog } from "../backoffice/DeleteConfirmationDialog";

interface IngredientGroupSectionProps {
  group: string;
  ingredients: Ingredient[];
  onUpdateIngredient: (index: number, updates: Partial<Ingredient>) => void;
  onRemoveIngredient: (index: number) => void;
  onAddIngredient: (name: string, group: string) => void;
}

export function IngredientGroupSection({
  group,
  ingredients,
  onUpdateIngredient,
  onRemoveIngredient,
  onAddIngredient,
}: IngredientGroupSectionProps) {
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const COMMON_UNITS = ["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece", "to taste"];

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      onRemoveIngredient(deleteIndex);
      setShowDeleteDialog(false);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{group}</h4>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1 relative">
            <div
              className={`w-full border rounded-md p-2 flex items-center justify-between cursor-pointer ${
                editingIngredientIndex !== index ? 'hover:bg-accent hover:text-accent-foreground' : ''
              }`}
              onClick={() => setEditingIngredientIndex(index)}
            >
              <span className={ingredient.name ? 'text-foreground' : 'text-muted-foreground'}>
                {ingredient.name || 'Search or add ingredient...'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${editingIngredientIndex === index ? 'rotate-180' : ''}`} />
            </div>

            {editingIngredientIndex === index && (
              <div className="absolute w-full z-50">
                <IngredientSuggestions 
                  onSelect={(name) => {
                    onUpdateIngredient(index, { name });
                    setEditingIngredientIndex(null);
                  }}
                  onClose={() => setEditingIngredientIndex(null)}
                />
              </div>
            )}
          </div>
          <Input
            placeholder="Amount"
            value={ingredient.amount}
            onChange={(e) => onUpdateIngredient(index, { amount: e.target.value })}
            className="w-24"
          />
          <Select
            value={ingredient.unit}
            onValueChange={(value) => onUpdateIngredient(index, { unit: value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_UNITS.map(unit => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAddDialog(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ingredient to {group}
      </Button>

      <IngredientFormDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onIngredientAdd={(name) => onAddIngredient(name, group)}
        group={group}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Ingredient"
        description="Are you sure you want to delete this ingredient? This action cannot be undone."
      />
    </div>
  );
}