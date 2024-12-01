import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/event";
import { TopBar } from "../TopBar";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EventTimeline } from "./EventTimeline";
import { EventParticipants } from "./EventParticipants";
import { EventMenu } from "./EventMenu";
import { EventDiscussion } from "./EventDiscussion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

export function EventDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      console.log('Fetching event with ID:', id);
      if (!id) throw new Error('No event ID provided');
      
      const eventDoc = await getDoc(doc(db, 'events', id));
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      return { id: eventDoc.id, ...eventDoc.data() } as Event;
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  const handleVote = (recipeId: string) => {
    console.log('Voted for recipe:', recipeId);
    toast({
      title: "Vote recorded",
      description: "Your vote has been added to this recipe suggestion.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-2xl font-bold">{event.title}</h1>
          
          {event.coverImage && (
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
              <img 
                src={event.coverImage} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="font-medium">{event.date} at {event.time}</span>
            </div>
            <p className="text-gray-600">
              {event.description}
            </p>
            <div className="mt-4">
              <strong>Location:</strong> {event.location.name}
            </div>
          </Card>

          <EventParticipants 
            participants={event.guests.map(guest => ({
              name: guest.name,
              status: guest.status,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + guest.id
            }))} 
          />

          <EventMenu dishes={event.dishes || []} />
          <EventDiscussion messages={[]} />
        </div>
      </main>
    </div>
  );
}