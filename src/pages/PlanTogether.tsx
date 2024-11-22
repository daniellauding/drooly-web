import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  date: Date;
  participants: string[];
  dishes: {
    name: string;
    assignedTo: string;
  }[];
}

export default function PlanTogether() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Mock events - in a real app, this would come from a backend
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "New Year's Eve Dinner",
      date: new Date(2024, 11, 31),
      participants: ["Sarah", "Mike", "Emma"],
      dishes: [
        { name: "Roast Turkey", assignedTo: "Sarah" },
        { name: "Apple Pie", assignedTo: "Mike" },
        { name: "Mashed Potatoes", assignedTo: "Emma" }
      ]
    }
  ]);

  const handleCreateEvent = () => {
    toast({
      title: "Coming Soon",
      description: "The ability to create new events will be available soon!",
    });
  };

  const handleJoinEvent = () => {
    toast({
      title: "Coming Soon",
      description: "The ability to join events will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20 pt-6">
      <div className="container max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Plan Together</h1>
        
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        <div className="space-y-4">
          <Button 
            className="w-full gap-2" 
            onClick={handleCreateEvent}
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleJoinEvent}
          >
            <Users className="h-4 w-4" />
            Join Event
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          {events.map((event) => (
            <Card key={event.id} className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.date.toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Participants:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant) => (
                    <span 
                      key={participant}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Dishes:</h4>
                <div className="space-y-2">
                  {event.dishes.map((dish) => (
                    <div 
                      key={dish.name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{dish.name}</span>
                      <span className="text-gray-500">{dish.assignedTo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}