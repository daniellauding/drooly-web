import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Plus } from "lucide-react";
import { GuestList } from "./GuestList";
import { EventMenu } from "./EventMenu";
import { createEvent } from "@/services/eventService";
import { useToast } from "@/components/ui/use-toast";
import { Event, EventGuest } from "@/types/event";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecipeCard } from "../RecipeCard";
import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "@/services/recipeService";

interface EventPageProps {
  id?: string;
}

export function EventPage({ id }: EventPageProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("Potluck Dinner Party");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState({
    name: "",
    address: ""
  });
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);

  // Fetch user's recipes
  const { data: recipes } = useQuery({
    queryKey: ['recipes', user?.uid],
    queryFn: () => getRecipes({ creatorId: user?.uid }),
    enabled: !!user
  });

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an event",
        variant: "destructive"
      });
      return;
    }

    try {
      const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        date,
        time,
        location,
        createdBy: user.uid,
        guests,
        dishes: []
      };

      const eventId = await createEvent(eventData);
      toast({
        title: "Success!",
        description: "Your event has been created"
      });
      navigate(`/plan/${eventId}`);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddGuest = (guest: EventGuest) => {
    setGuests([...guests, guest]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
          placeholder="Event Title"
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-lg text-muted-foreground resize-none border-none px-0 focus-visible:ring-0"
          placeholder="Add a description..."
        />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">When?</span>
        </div>
        <div className="pl-7 space-y-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">Where?</span>
        </div>
        <div className="pl-7 space-y-4">
          <Input
            placeholder="Location name"
            value={location.name}
            onChange={(e) => setLocation(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Address"
            value={location.address}
            onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
      </Card>

      <GuestList guests={guests} onAddGuest={handleAddGuest} />

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <span className="font-medium">What's cooking?</span>
          </div>
          <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Select Recipe</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
                {recipes?.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    onClick={() => {
                      // Handle recipe selection
                      setShowRecipeDialog(false);
                    }}
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <EventMenu dishes={[]} />
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/plan')}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Create Event
        </Button>
      </div>
    </div>
  );
}