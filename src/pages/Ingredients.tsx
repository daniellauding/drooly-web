import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingListTabs } from "@/components/shopping/ShoppingListTabs";

export default function Ingredients() {
  const { user } = useAuth();
  const [listId, setListId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setListId(`${user.uid}_shopping_list`);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-8">
        <ShoppingListTabs userId={user?.uid} listId={listId} />
      </main>
    </div>
  );
}