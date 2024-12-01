import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserSearchAutocomplete } from "@/components/event/UserSearchAutocomplete";
import { useToast } from "@/components/ui/use-toast";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ShareShoppingListProps {
  userId: string;
  listId: string;
}

export function ShareShoppingList({ userId, listId }: ShareShoppingListProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async (email: string) => {
    try {
      const sharedListRef = doc(db, "sharedLists", listId);
      await setDoc(sharedListRef, {
        owner: userId,
        sharedWith: email,
        createdAt: new Date(),
      });

      await updateDoc(doc(db, "users", userId, "shoppingList", "checkedItems"), {
        sharedWith: email,
      });

      toast({
        title: "List shared",
        description: `Shopping list has been shared with ${email}`,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error sharing list:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share shopping list",
      });
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Share2 className="h-4 w-4 mr-2" />
        Share List
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Shopping List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <UserSearchAutocomplete
              onSelect={(email) => handleShare(email)}
              value=""
              onChange={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}