import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventTimeline } from "@/components/event/EventTimeline";
import { EventParticipants } from "@/components/event/EventParticipants";
import { EventMenu } from "@/components/event/EventMenu";
import { EventDiscussion } from "@/components/event/EventDiscussion";
import { RecipeCard } from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";

type Participant = {
  name: string;
  status: "accepted" | "pending" | "declined";
  avatar: string;
};

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const timelineEvents = [
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
  ];

  const participants: Participant[] = [
    { name: "Sarah", status: "accepted", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    { name: "Mike", status: "accepted", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
    { name: "Emma", status: "pending", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" }
  ];

  const handleVote = (recipeId: string) => {
    console.log('Voted for recipe:', recipeId);
    toast({
      title: "Vote recorded",
      description: "Your vote has been added to this recipe suggestion.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20">
      <TopBar />
      <div className="container max-w-md mx-auto space-y-6 pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => navigate(-1)}
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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Event Timeline</h2>
          <EventTimeline events={timelineEvents} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Participants</h2>
          <EventParticipants participants={participants} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <EventMenu dishes={[]} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Discussion</h2>
          <EventDiscussion messages={[]} />
        </div>
      </div>
      <BottomBar />
    </div>
  );
}