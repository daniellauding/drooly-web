import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EventTimeline } from "./EventTimeline";
import { EventParticipants } from "./EventParticipants";
import { EventMenu } from "./EventMenu";
import { EventDiscussion } from "./EventDiscussion";
import { RecipeCard } from "../RecipeCard";
import { useToast } from "../ui/use-toast";

interface EventDetailViewProps {
  onBack: () => void;
}

export function EventDetailView({ onBack }: EventDetailViewProps) {
  const { toast } = useToast();

  const handleVote = (recipeId: string) => {
    console.log('Voted for recipe:', recipeId);
    toast({
      title: "Vote recorded",
      description: "Your vote has been added to this recipe suggestion.",
    });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="icon"
        className="mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <h1 className="text-2xl font-bold">New Year's Eve Dinner</h1>
      
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="font-medium">Dec 31, 2024</span>
        </div>
        <p className="text-gray-600">
          Join us for an amazing New Year's celebration with delicious food and great company!
        </p>
      </Card>

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
  );
}
