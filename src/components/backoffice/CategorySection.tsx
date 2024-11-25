import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CategorySectionProps {
  name: string;
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (item: string) => void;
}

export function CategorySection({ name, items, onAddItem, onRemoveItem }: CategorySectionProps) {
  const [newItem, setNewItem] = useState("");
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    onAddItem(newItem.trim());
    setNewItem("");
    
    toast({
      title: "Item added",
      description: `Added "${newItem}" to ${name}`,
    });
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {name}
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add new ${name} item...`}
            />
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Current Items</h4>
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <div
                key={item}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
              >
                {item}
                <button
                  onClick={() => onRemoveItem(item)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}