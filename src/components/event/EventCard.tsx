import { Event } from "@/types/event";
import { format } from "date-fns";
import { CalendarDays, Clock, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const eventDate = new Date(event.date);
  const isPast = eventDate <= new Date();

  return (
    <button
      onClick={() => navigate(`/events/${event.id}`)}
      className="group p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-left w-full"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-lg mb-2">{event.title}</h3>
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
      
      <p className="text-sm text-white/60 mb-4 line-clamp-2">
        {event.description}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-white/60">
          <CalendarDays className="w-4 h-4 mr-2" />
          {format(eventDate, 'PPP')}
        </div>
        
        <div className="flex items-center text-sm text-white/60">
          <Clock className="w-4 h-4 mr-2" />
          {event.time}
        </div>
        
        <div className="flex items-center text-sm text-white/60">
          <Users className="w-4 h-4 mr-2" />
          {event.guests.length} guest{event.guests.length !== 1 ? 's' : ''}
        </div>
      </div>
    </button>
  );
}