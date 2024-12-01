import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Star, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IngredientItem } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface HistoryItem {
  id: string;
  items: IngredientItem[];
  checkedAt: Date;
  recurrence: "none" | "weekly" | "monthly";
}

interface ShoppingHistoryProps {
  userId: string;
  onAddToList?: (items: IngredientItem[]) => void;
  onSetRecurring?: (ingredient: IngredientItem, recurrence: "none" | "weekly" | "monthly") => void;
}

export function ShoppingHistory({ userId, onAddToList, onSetRecurring }: ShoppingHistoryProps) {
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

  const setRecurrence = async (ingredient: IngredientItem, recurrence: "none" | "weekly" | "monthly") => {
    if (onSetRecurring) {
      onSetRecurring(ingredient, recurrence);
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

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No shopping history yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shopping History</h2>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <Accordion type="single" collapsible className="space-y-4">
          {history.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div>
                    <h3 className="font-semibold text-left">
                      {format(item.checkedAt, "MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground text-left">
                      {format(item.checkedAt, "h:mm a")} - {item.items.length} items
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
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCurrentList(item.items);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to List
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-4">
                  <ul className="space-y-2 divide-y">
                    {item.items.map((ingredient, idx) => (
                      <li key={`${item.id}-${idx}`} className="flex items-center justify-between py-2">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From: {ingredient.recipeTitle}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRecurrence(
                            ingredient,
                            ingredient.recurrence === "none" ? "monthly" : 
                            ingredient.recurrence === "monthly" ? "weekly" : "none"
                          )}
                        >
                          <Star className={`h-4 w-4 ${ingredient.recurrence !== "none" ? "text-yellow-500" : ""}`} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}