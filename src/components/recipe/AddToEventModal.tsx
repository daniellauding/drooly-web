import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Event } from "@/types/event";

interface AddToEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
}

export function AddToEventModal({ open, onOpenChange, recipeId, recipeTitle }: AddToEventModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;
      
      try {
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("createdBy", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        setEvents(eventsData);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    if (open) {
      loadEvents();
    }
  }, [open, user]);

  const handleAddToEvent = (eventId: string) => {
    navigate(`/events/edit/${eventId}?addRecipe=${recipeId}`);
    onOpenChange(false);
  };

  const handleCreateNewEvent = () => {
    navigate(`/create-event?addRecipe=${recipeId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={handleCreateNewEvent}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Event
          </Button>
          
          {events.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Or add to existing event:</h3>
              {events.map((event) => (
                <Button
                  key={event.id}
                  variant="outline"
                  className="w-full text-left"
                  onClick={() => handleAddToEvent(event.id)}
                >
                  {event.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}