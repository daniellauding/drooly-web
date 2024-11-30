import { TopBar } from "@/components/TopBar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EventGuest } from "@/types/event";
import { createEvent } from "@/services/eventService";
import { EventVerificationAlert } from "@/components/event/EventVerificationAlert";
import { EventForm } from "@/components/event/EventForm";

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateEvent = async (formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    guests: EventGuest[];
    isPrivate: boolean;
    password?: string;
  }) => {
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
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: {
          name: formData.location,
          address: ""
        },
        guests: formData.guests,
        dishes: [],
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: formData.isPrivate,
        ...(formData.isPrivate && formData.password ? { password: formData.password } : {})
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
          <EventVerificationAlert />
          <EventForm 
            onSubmit={handleCreateEvent}
            onCancel={() => navigate("/events")}
          />
        </div>
      </main>
    </div>
  );
}