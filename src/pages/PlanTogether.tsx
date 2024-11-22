import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Users, CalendarDays } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventTimeline } from "@/components/event/EventTimeline";
import { EventParticipants } from "@/components/event/EventParticipants";
import { EventMenu } from "@/components/event/EventMenu";
import { EventDiscussion } from "@/components/event/EventDiscussion";
import { RecipeCard } from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const SUGGESTED_RECIPES = [
  {
    id: "1",
    title: "Spicy Ramen Bowl",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&q=80",
    time: "30 mins",
    difficulty: "Medium",
    chef: "Chef Mike",
    date: "2 days ago",
    votes: 3
  },
  {
    id: "2",
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80",
    time: "15 mins",
    difficulty: "Easy",
    chef: "Chef Sarah",
    date: "Yesterday",
    votes: 1
  }
];

export default function PlanTogether() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVote = (recipeId: string) => {
    console.log('Voted for recipe:', recipeId);
    toast({
      title: "Vote recorded",
      description: "Your vote has been added to this recipe suggestion.",
    });
  };

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
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-2xl font-bold">New Year's Eve Dinner</h1>
          
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-medium">Dec 31, 2024</span>
              </div>
              <p className="text-gray-600">Join us for an amazing New Year's celebration with delicious food and great company!</p>
            </Card>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Suggested Recipes</h2>
              <div className="grid gap-4">
                {SUGGESTED_RECIPES.map((recipe) => (
                  <div key={recipe.id} className="space-y-2">
                    <RecipeCard {...recipe} />
                    <div className="flex justify-between items-center px-4">
                      <span className="text-sm text-gray-600">{recipe.votes} votes</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVote(recipe.id)}
                      >
                        Vote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EventParticipants 
              participants={[
                { name: "Sarah", status: "accepted", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
                { name: "Mike", status: "accepted", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
                { name: "Emma", status: "pending", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" }
              ]} 
            />

            <EventTimeline 
              events={[
                {
                  id: "1",
                  time: "10:30 AM",
                  description: "Sarah suggested Spicy Ramen Bowl",
                  user: "Sarah",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                },
                {
                  id: "2",
                  time: "10:35 AM",
                  description: "Mike voted for Spicy Ramen Bowl",
                  user: "Mike",
                  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
                }
              ]} 
            />

            <EventMenu dishes={[]} />
            <EventDiscussion messages={[]} />
          </div>
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