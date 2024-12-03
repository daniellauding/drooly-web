import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingHistory } from "@/components/shopping/ShoppingHistory";
import { ShoppingListContent } from "./ShoppingListContent";

interface ShoppingListTabsProps {
  userId: string | undefined;
  listId: string;
}

export function ShoppingListTabs({ userId, listId }: ShoppingListTabsProps) {
  return (
    <Tabs defaultValue="current">
      <TabsList>
        <TabsTrigger value="current">Current List</TabsTrigger>
        <TabsTrigger value="history">Shopping History</TabsTrigger>
      </TabsList>

      <TabsContent value="current">
        <ShoppingListContent />
      </TabsContent>

      <TabsContent value="history">
        <ShoppingHistory userId={userId || ""} />
      </TabsContent>
    </Tabs>
  );
}