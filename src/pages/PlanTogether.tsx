import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Users, CalendarDays } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventDetailView } from "@/components/event/EventDetailView";

// Mock data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "New Year's Eve Dinner",
    date: "Dec 31, 2024",
    participants: 8,
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&q=80"
  },
  {
    id: "2",
    title: "Weekend Brunch",
    date: "Jan 7, 2024",
    participants: 4,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80"
  }
];

export default function PlanTogether() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEventClick = (eventId: string) => {
    console.log('Selected event:', eventId);
    setSelectedEvent(eventId);
  };

  const handleBack = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
    } else {
      navigate(-1);
    }
  };

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] pb-20">
        <TopBar />
        <div className="container max-w-md mx-auto space-y-6 pt-4">
          <EventDetailView onBack={handleBack} />
        </div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20">
      <TopBar />
      <div className="container max-w-md mx-auto space-y-6 pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-2xl font-bold">Plan Together</h1>
        
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {UPCOMING_EVENTS.map((event) => (
                <Card 
                  key={event.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="flex gap-4">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full gap-2" 
            onClick={() => toast({
              title: "Coming Soon",
              description: "The ability to create new events will be available soon!",
            })}
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => toast({
              title: "Coming Soon",
              description: "The ability to join events will be available soon!",
            })}
          >
            <Users className="h-4 w-4" />
            Join Event
          </Button>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}