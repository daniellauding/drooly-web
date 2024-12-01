import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/event";
import { TopBar } from "../TopBar";
import { ArrowLeft, CalendarDays, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EventTimeline } from "./EventTimeline";
import { EventParticipants } from "./EventParticipants";
import { EventMenu } from "./EventMenu";
import { EventDiscussion } from "./EventDiscussion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EventRoleManager } from "./EventRoleManager";

export function EventDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: event, isLoading, refetch } = useQuery({
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

  const isCreator = event?.createdBy === user?.uid;
  const isAdmin = isCreator || event?.guests.some(guest => 
    guest.id === user?.uid && guest.role === "admin"
  );

  const handleRoleChange = async (guestId: string, newRole: string) => {
    if (!event || !isCreator) return;

    try {
      const updatedGuests = event.guests.map(guest =>
        guest.id === guestId ? { ...guest, role: newRole } : guest
      );

      await updateDoc(doc(db, 'events', event.id), {
        guests: updatedGuests
      });

      await refetch();
      
      toast({
        title: "Role updated",
        description: "Guest role has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating guest role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update guest role. Please try again."
      });
    }
  };

  const handleRemoveGuest = async (guestId: string) => {
    if (!event || !isCreator) return;

    try {
      const updatedGuests = event.guests.filter(guest => guest.id !== guestId);

      await updateDoc(doc(db, 'events', event.id), {
        guests: updatedGuests
      });

      await refetch();
      
      toast({
        title: "Guest removed",
        description: "Guest has been removed from the event."
      });
    } catch (error) {
      console.error('Error removing guest:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove guest. Please try again."
      });
    }
  };

  // Map the event guest status to participant status
  const mapGuestStatusToParticipantStatus = (status: 'coming' | 'not-coming' | 'pending'): 'accepted' | 'declined' | 'pending' => {
    switch (status) {
      case 'coming':
        return 'accepted';
      case 'not-coming':
        return 'declined';
      case 'pending':
        return 'pending';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Button
                onClick={() => navigate(`/events/edit/${event.id}`)}
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            )}
          </div>

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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Participants</h2>
            {event.guests.map(guest => (
              <div key={guest.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.id}`}
                    alt={guest.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{guest.name}</span>
                  {guest.role === "admin" && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <EventRoleManager
                  guest={guest}
                  isCreator={isCreator}
                  onRoleChange={handleRoleChange}
                  onRemoveGuest={handleRemoveGuest}
                />
              </div>
            ))}
          </div>

          <EventMenu dishes={event.dishes || []} />
          <EventDiscussion messages={[]} />
        </div>
      </main>
    </div>
  );
}