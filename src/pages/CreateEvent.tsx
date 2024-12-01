import { TopBar } from "@/components/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EventGuest } from "@/types/event";
import { createEvent } from "@/services/eventService";
import { EventVerificationAlert } from "@/components/event/EventVerificationAlert";
import { EventForm } from "@/components/event/EventForm";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;

  console.log("CreateEvent component rendered, edit mode:", isEditMode);

  // Fetch existing event data if in edit mode
  const { data: existingEvent, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      console.log('Fetching event data for editing, ID:', id);
      const eventDoc = await getDoc(doc(db, 'events', id));
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      return { id: eventDoc.id, ...eventDoc.data() };
    },
    enabled: isEditMode,
  });

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    guests: EventGuest[];
    isPrivate: boolean;
    isHidden: boolean;
    password?: string;
    coverImage?: string;
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to manage events",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && id) {
        console.log("Updating existing event:", id);
        // Update existing event
        await updateDoc(doc(db, 'events', id), {
          ...formData,
          location: {
            name: formData.location,
            address: ""
          },
          updatedAt: new Date()
        });

        toast({
          title: "Success",
          description: "Event updated successfully!"
        });
      } else {
        console.log("Creating new event");
        // Create new event
        const eventData = {
          ...formData,
          location: {
            name: formData.location,
            address: ""
          },
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
      }
      
      navigate("/events");
    } catch (error: any) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage event. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-background pb-32 md:pb-6">
        <TopBar />
        <main className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            Loading event data...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-6">
      <TopBar />
      <main className="container max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
          <EventVerificationAlert />
          <EventForm 
            onSubmit={handleSubmit}
            onCancel={() => navigate("/events")}
            initialData={existingEvent}
          />
        </div>
      </main>
    </div>
  );
}