import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/types/event";
import { getUserEvents } from "@/services/eventService";
import { format } from "date-fns";
import { Plus, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface EventPageProps {
  onCreateNew?: () => void;
}

const EventPage = ({ onCreateNew }: EventPageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user?.uid],
    queryFn: () => getUserEvents(user?.uid || ''),
    enabled: !!user?.uid
  });

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      navigate('/create-event');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Plan Together</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No upcoming events</p>
              <Button 
                variant="outline" 
                onClick={handleCreateNew}
                className="mt-4"
              >
                Create your first event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(new Date(event.date), 'PPP')}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
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
    </div>
  );
};

export default EventPage;