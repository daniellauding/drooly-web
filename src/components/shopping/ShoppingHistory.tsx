import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { IngredientItem } from "./types";

interface HistoryItem {
  id: string;
  items: IngredientItem[];
  checkedAt: Date;
  recurrence: string;
}

interface ShoppingHistoryProps {
  userId: string;
}

export function ShoppingHistory({ userId }: ShoppingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;

      const historyRef = collection(db, "users", userId, "shoppingHistory");
      const q = query(historyRef, orderBy("checkedAt", "desc"));
      
      try {
        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          checkedAt: doc.data().checkedAt.toDate()
        })) as HistoryItem[];
        
        setHistory(historyData);
      } catch (error) {
        console.error("Error loading shopping history:", error);
      }
    };

    loadHistory();
  }, [userId]);

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
              {item.recurrence !== "none" && (
                <Badge variant="secondary">
                  {item.recurrence}
                </Badge>
              )}
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