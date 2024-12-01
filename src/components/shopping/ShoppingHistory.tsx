import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IngredientItem } from "./types";

interface HistoryItem {
  id: string;
  items: IngredientItem[];
  checkedAt: Date;
  recurrence: "none" | "weekly" | "monthly";
}

interface ShoppingHistoryProps {
  userId: string;
  onAddToList?: (items: IngredientItem[]) => void;
}

export function ShoppingHistory({ userId, onAddToList }: ShoppingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;

      const historyRef = collection(db, "users", userId, "shoppingHistory");
      const q = query(historyRef, orderBy("checkedAt", "desc"));
      
      try {
        console.log("Loading shopping history for user:", userId);
        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          checkedAt: doc.data().checkedAt.toDate()
        })) as HistoryItem[];
        
        console.log("Loaded history items:", historyData.length);
        setHistory(historyData);
      } catch (error) {
        console.error("Error loading shopping history:", error);
        toast({
          title: "Error",
          description: "Failed to load shopping history",
          variant: "destructive"
        });
      }
    };

    loadHistory();
  }, [userId, toast]);

  const setRecurrence = async (historyId: string, recurrence: "none" | "weekly" | "monthly") => {
    try {
      const historyRef = doc(db, "users", userId, "shoppingHistory", historyId);
      await updateDoc(historyRef, { recurrence });
      
      setHistory(prev => prev.map(item => 
        item.id === historyId ? { ...item, recurrence } : item
      ));

      toast({
        title: "Updated",
        description: `Items set to repeat ${recurrence}ly`
      });
    } catch (error) {
      console.error("Error updating recurrence:", error);
      toast({
        title: "Error",
        description: "Failed to update recurrence",
        variant: "destructive"
      });
    }
  };

  const addToCurrentList = (items: IngredientItem[]) => {
    if (onAddToList) {
      onAddToList(items);
      toast({
        title: "Added to list",
        description: "Items have been added to your current shopping list"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shopping History</h2>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {history.map((item) => (
          <Card key={item.id} className="p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">
                  {format(item.checkedAt, "MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(item.checkedAt, "h:mm a")}
                </p>
              </div>
              <div className="flex gap-2">
                {item.recurrence !== "none" && (
                  <Badge variant="secondary">
                    {item.recurrence}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToCurrentList(item.items)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRecurrence(item.id, 
                    item.recurrence === "none" ? "monthly" : 
                    item.recurrence === "monthly" ? "weekly" : "none"
                  )}
                >
                  <Star className={`h-4 w-4 ${item.recurrence !== "none" ? "text-yellow-500" : ""}`} />
                </Button>
              </div>
            </div>
            <ul className="space-y-2">
              {item.items.map((ingredient, idx) => (
                <li key={`${item.id}-${idx}`} className="text-sm">
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                  <span className="text-muted-foreground ml-2">
                    ({ingredient.recipeTitle})
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}