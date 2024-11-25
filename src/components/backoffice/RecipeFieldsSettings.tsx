import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  CUISINES,
  RECIPE_CATEGORIES,
  OCCASIONS,
  SEASONS,
  COOKING_EQUIPMENT,
  COST_CATEGORIES,
} from "@/types/recipe";

interface FieldCategory {
  name: string;
  items: string[];
}

export function RecipeFieldsSettings() {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("cuisines");
  
  const [fieldCategories, setFieldCategories] = useState<FieldCategory[]>([
    { name: "cuisines", items: [...CUISINES] },
    { name: "categories", items: [...RECIPE_CATEGORIES] },
    { name: "occasions", items: [...OCCASIONS] },
    { name: "seasons", items: [...SEASONS] },
    { name: "equipment", items: [...COOKING_EQUIPMENT] },
    { name: "costs", items: [...COST_CATEGORIES] },
  ]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    setFieldCategories(prev => prev.map(category => {
      if (category.name === selectedCategory) {
        return {
          ...category,
          items: [...category.items, newItem.trim()]
        };
      }
      return category;
    }));

    setNewItem("");
    toast({
      title: "Item added",
      description: `Added "${newItem}" to ${selectedCategory}`,
    });
  };

  const handleRemoveItem = (categoryName: string, item: string) => {
    setFieldCategories(prev => prev.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          items: category.items.filter(i => i !== item)
        };
      }
      return category;
    }));

    toast({
      title: "Item removed",
      description: `Removed "${item}" from ${categoryName}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Add New Item</label>
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter new item..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {fieldCategories.map(category => (
              <option key={category.name} value={category.name}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {fieldCategories.map(category => (
          <div key={category.name} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map(item => (
                <div
                  key={item}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {item}
                  <button
                    onClick={() => handleRemoveItem(category.name, item)}
                    className="hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}