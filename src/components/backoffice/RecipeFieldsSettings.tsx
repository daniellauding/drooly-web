import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  CUISINES,
  RECIPE_CATEGORIES,
  OCCASIONS,
  SEASONS,
  COOKING_EQUIPMENT,
  COST_CATEGORIES,
} from "@/types/recipe";
import { CategorySection } from "./CategorySection";

interface FieldCategory {
  name: string;
  items: string[];
}

export function RecipeFieldsSettings() {
  const { toast } = useToast();
  
  const [fieldCategories, setFieldCategories] = useState<FieldCategory[]>([
    { name: "cuisines", items: [...CUISINES] },
    { name: "categories", items: [...RECIPE_CATEGORIES] },
    { name: "occasions", items: [...OCCASIONS] },
    { name: "seasons", items: [...SEASONS] },
    { name: "equipment", items: [...COOKING_EQUIPMENT] },
    { name: "costs", items: [...COST_CATEGORIES] },
  ]);

  const handleAddItem = (categoryName: string, newItem: string) => {
    setFieldCategories(prev => prev.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          items: [...category.items, newItem]
        };
      }
      return category;
    }));
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
      {fieldCategories.map(category => (
        <CategorySection
          key={category.name}
          name={category.name}
          items={category.items}
          onAddItem={(item) => handleAddItem(category.name, item)}
          onRemoveItem={(item) => handleRemoveItem(category.name, item)}
        />
      ))}
    </div>
  );
}