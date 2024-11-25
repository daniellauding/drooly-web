import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FieldCategory {
  name: string;
  items: string[];
  suggestions: string[];
}

export function RecipeFieldsSettings() {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("cuisines");
  
  const [fieldCategories, setFieldCategories] = useState<FieldCategory[]>([
    { name: "cuisines", items: [...CUISINES], suggestions: ["Brazilian BBQ", "Nordic"] },
    { name: "categories", items: [...RECIPE_CATEGORIES], suggestions: ["Student Budget", "Quick Lunch"] },
    { name: "occasions", items: [...OCCASIONS], suggestions: ["Office Party", "Brunch"] },
    { name: "seasons", items: [...SEASONS], suggestions: ["Mid-Summer", "Early Spring"] },
    { name: "equipment", items: [...COOKING_EQUIPMENT], suggestions: ["Rice Cooker", "Food Processor"] },
    { name: "costs", items: [...COST_CATEGORIES], suggestions: ["$40-$50", "$50+"] },
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

  const handleApproveSuggestion = (categoryName: string, suggestion: string) => {
    setFieldCategories(prev => prev.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          items: [...category.items, suggestion],
          suggestions: category.suggestions.filter(s => s !== suggestion)
        };
      }
      return category;
    }));

    toast({
      title: "Suggestion approved",
      description: `Added "${suggestion}" to ${categoryName}`,
    });
  };

  const handleRemoveSuggestion = (categoryName: string, suggestion: string) => {
    setFieldCategories(prev => prev.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          suggestions: category.suggestions.filter(s => s !== suggestion)
        };
      }
      return category;
    }));

    toast({
      title: "Suggestion removed",
      description: `Removed suggestion "${suggestion}" from ${categoryName}`,
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

      <div className="space-y-8">
        {fieldCategories.map(category => (
          <div key={category.name} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {category.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Items</h4>
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

              {category.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">User Suggestions</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.suggestions.map(suggestion => (
                      <div
                        key={suggestion}
                        className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {suggestion}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApproveSuggestion(category.name, suggestion)}
                            className="hover:text-green-600"
                            title="Approve suggestion"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveSuggestion(category.name, suggestion)}
                            className="hover:text-destructive"
                            title="Remove suggestion"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}