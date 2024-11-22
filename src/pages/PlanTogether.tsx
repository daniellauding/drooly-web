import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, MessageCircle, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface Dish {
  name: string;
  assignedTo: string;
  ingredients: string[];
}

interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  participants: {
    name: string;
    status: 'accepted' | 'pending' | 'declined';
    avatar: string;
  }[];
  dishes: Dish[];
  messages: Message[];
}

export default function PlanTogether() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Mock event data
  const [events] = useState<Event[]>([
    {
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
            <Card key={event.id} className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-xl">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.date.toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-600">{event.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant) => (
                    <div 
                      key={participant.name}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      <img 
                        src={participant.avatar} 
                        alt={participant.name} 
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{participant.name}</span>
                      <span className="text-xs">
                        ({participant.status})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Menu & Responsibilities
                </h4>
                <div className="space-y-2">
                  {event.dishes.map((dish) => (
                    <div 
                      key={dish.name}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{dish.name}</span>
                        <span className="text-gray-500">by {dish.assignedTo}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Ingredients: {dish.ingredients.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Discussion
                </h4>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {event.messages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}