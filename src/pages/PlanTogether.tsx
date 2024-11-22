import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventTimeline } from "@/components/event/EventTimeline";
import { EventParticipants } from "@/components/event/EventParticipants";
import { EventMenu } from "@/components/event/EventMenu";
import { EventDiscussion } from "@/components/event/EventDiscussion";

export default function PlanTogether() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const timelineEvents = [
    {
      id: "1",
      time: "10:30 AM",
      description: "Sarah added Roast Turkey to the menu",
      user: "Sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    {
      id: "2",
      time: "10:35 AM",
      description: "Mike confirmed attendance and will bring Apple Pie",
      user: "Mike",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
    }
  ];

  const event = {
    id: "1",
    title: "New Year's Eve Dinner",
    date: new Date(2024, 11, 31),
    description: "Let's celebrate the new year together with a festive dinner! Everyone brings their signature dish.",
    participants: [
      { name: "Sarah", status: 'accepted', avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
      { name: "Mike", status: 'accepted', avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
      { name: "Emma", status: 'pending', avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" }
    ],
    dishes: [
      { 
        name: "Roast Turkey", 
        assignedTo: "Sarah",
        ingredients: ["Turkey", "Herbs", "Butter", "Garlic", "Onion"]
      },
      { 
        name: "Apple Pie", 
        assignedTo: "Mike",
        ingredients: ["Apples", "Flour", "Sugar", "Cinnamon", "Butter"]
      },
      { 
        name: "Mashed Potatoes", 
        assignedTo: "Emma",
        ingredients: ["Potatoes", "Milk", "Butter", "Salt", "Pepper"]
      }
    ],
    messages: [
      {
        id: "m1",
        sender: "Sarah",
        text: "I'll bring my special roast turkey recipe!",
        timestamp: new Date(2024, 11, 30, 10, 30)
      },
      {
        id: "m2",
        sender: "Mike",
        text: "Great! I can make my famous apple pie for dessert.",
        timestamp: new Date(2024, 11, 30, 10, 35)
      }
    ]
  };

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
          <h2 className="text-lg font-semibold">Event Timeline</h2>
          <EventTimeline events={timelineEvents} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Card key={event.id} className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold text-xl">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date.toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-600">{event.description}</p>
            </div>
            
            <EventParticipants participants={event.participants} />
            <EventMenu dishes={event.dishes} />
            <EventDiscussion messages={event.messages} />
          </Card>
        </div>
      </div>
    </div>
  );
}