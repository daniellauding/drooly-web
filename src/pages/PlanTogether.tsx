import { TopBar } from "@/components/TopBar";
import { useState } from "react";
import { GuestList } from "@/components/event/GuestList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { EventGuest } from "@/types/event";
import { createEvent } from "@/services/eventService";
import EventPage from "@/components/event/EventPage";

export default function PlanTogether() {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddGuest = (guest: EventGuest) => {
    setGuests([...guests, guest]);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event",
        variant: "destructive"
      });
      return;
    }

    try {
      const eventData = {
        title,
        description,
        date,
        time,
        location: {
          name: location,
          address: ""
        },
        guests,
        dishes: [],
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createEvent(eventData);
      
      toast({
        title: "Success",
        description: "Event created successfully!"
      });
      
      setIsCreating(false);
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isCreating) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container max-w-6xl mx-auto px-4 py-6">
          <EventPage onCreateNew={() => setIsCreating(true)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Create New Event</h1>
          
          <form onSubmit={handleCreateEvent} className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Event Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's the occasion?"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      <CalendarDays className="w-4 h-4 inline-block mr-1" />
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                      <Clock className="w-4 h-4 inline-block mr-1" />
                      Time
                    </label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    <MapPin className="w-4 h-4 inline-block mr-1" />
                    Location
                  </label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where is it happening?"
                    required
                  />
                </div>
              </div>
            </Card>

            <GuestList guests={guests} onAddGuest={handleAddGuest} />

            <div className="flex gap-4">
              <Button type="submit">Create Event</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}