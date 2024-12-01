import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserEvents } from "@/services/eventService";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface AddToEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
}

export function AddToEventModal({
  open,
  onOpenChange,
  recipeId,
  recipeTitle,
}: AddToEventModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ['events', user?.uid],
    queryFn: () => getUserEvents(user?.uid || ''),
    enabled: !!user?.uid
  });

  const handleAddToEvent = async (eventId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Add recipe to event
      await updateDoc(doc(db, "events", eventId), {
        recipes: arrayUnion({
          id: recipeId,
          title: recipeTitle,
          addedAt: new Date()
        })
      });

      // Add event to recipe
      await updateDoc(doc(db, "recipes", recipeId), {
        events: arrayUnion(eventId)
      });

      toast({
        title: "Success",
        description: "Recipe added to event"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding recipe to event:", error);
      toast({
        title: "Error",
        description: "Failed to add recipe to event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground">No events found. Create an event first.</p>
          ) : (
            events.map((event) => (
              <Button
                key={event.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddToEvent(event.id)}
                disabled={isLoading}
              >
                {event.title}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}