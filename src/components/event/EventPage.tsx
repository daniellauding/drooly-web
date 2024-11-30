import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { Event } from "@/types/event";
import { getUserEvents } from "@/services/eventService";
import { format } from "date-fns";
import { Plus, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const EventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user?.uid],
    queryFn: () => getUserEvents(user?.uid || ''),
    enabled: !!user?.uid
  });

  const upcomingEvents = (events as Event[]).filter(event => new Date(event.date) > new Date());
  const pastEvents = (events as Event[]).filter(event => new Date(event.date) <= new Date());

  return (
    <div className="min-h-screen bg-[#191919] text-white">
      <TopBar />
      
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          <Button 
            onClick={() => navigate('/plan')} 
            className="bg-white/10 hover:bg-white/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p>No upcoming events</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/plan')}
                  className="mt-4"
                >
                  Create your first event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(event.date), 'PPP')}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Users className="w-4 h-4 mr-2" />
                        {event.guests.length} guest{event.guests.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-medium">Past Events</h2>
            {pastEvents.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p>No past events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map(event => (
                  <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(event.date), 'PPP')}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Users className="w-4 h-4 mr-2" />
                        {event.guests.length} guest{event.guests.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventPage;