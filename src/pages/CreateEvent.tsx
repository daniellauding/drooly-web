import { TopBar } from "@/components/TopBar";
import { useState } from "react";
import { GuestList } from "@/components/event/GuestList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { EventGuest } from "@/types/event";
import { createEvent } from "@/services/eventService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
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

    if (!user.emailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email before creating events. Check your inbox for a verification link.",
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
        updatedAt: new Date(),
        isPrivate,
        ...(isPrivate && password ? { password } : {})
      };

      await createEvent(eventData);
      
      toast({
        title: "Success",
        description: "Event created successfully!"
      });
      
      navigate("/events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Create New Event</h1>

          {user && !user.emailVerified && (
            <Alert variant="destructive">
              <AlertDescription>
                Please verify your email before creating events. Check your inbox for a verification link.
              </AlertDescription>
            </Alert>
          )}
          
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Private Event</Label>
                      <p className="text-sm text-muted-foreground">
                        Only invited guests can see this event
                      </p>
                    </div>
                    <Switch
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>

                  {isPrivate && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1">
                        <Lock className="w-4 h-4 inline-block mr-1" />
                        Event Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Optional: Set a password for uninvited guests"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <GuestList guests={guests} onAddGuest={handleAddGuest} />

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary">Create Event</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/events")}
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