import { TopBar } from "@/components/TopBar";
import { getUserEvents } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { Plus, CalendarDays, History, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/event/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/types/event";

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user?.uid],
    queryFn: () => getUserEvents(user?.uid || ''),
    enabled: !!user?.uid,
  });

  // Filter events based on privacy and user access
  const filterEvents = (events: Event[]) => {
    return events.filter(event => {
      // Show if user is creator
      if (event.createdBy === user?.uid) return true;
      
      // Show if user is invited guest
      if (event.guests.some(guest => guest.id === user?.uid)) return true;
      
      // Show if event is not private
      if (!event.isPrivate) return true;
      
      return false;
    });
  };

  const filteredEvents = filterEvents(events);
  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) <= new Date());

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          <Button 
            onClick={() => navigate('/create-event')} 
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              <CalendarClock className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past">
              <History className="w-4 h-4 mr-2" />
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming events</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/create-event')}
                  className="mt-4"
                >
                  Create your first event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No past events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}