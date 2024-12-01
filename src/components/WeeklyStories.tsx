import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/types/story";

interface WeeklyPlan {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  title: string;
  day: string;
  mealType: string;
  status: string;
}

interface WeeklyStoriesProps {
  users: Story[];
  onUserClick: (index: number) => void;
}

export function WeeklyStories({ users, onUserClick }: WeeklyStoriesProps) {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);

  useEffect(() => {
    const fetchWeeklyPlans = async () => {
      console.log("Fetching weekly plans...");
      const q = query(
        collection(db, "weeklyPlans"),
        where("status", "==", "planned"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const plans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WeeklyPlan));
      
      console.log("Fetched weekly plans:", plans);
      setWeeklyPlans(plans);
    };

    fetchWeeklyPlans();
  }, []);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 p-4">
        {weeklyPlans.map((plan) => (
          <div 
            key={plan.id} 
            className="text-center cursor-pointer"
            onClick={() => window.location.href = `/recipe/${plan.recipeId}`}
          >
            <div className="relative mb-2">
              <Avatar className="w-16 h-16 ring-2 ring-primary p-0.5 hover:ring-offset-2 transition-all">
                <AvatarImage src={plan.userAvatar} alt={plan.userName} />
                <AvatarFallback>{plan.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {plan.mealType}
              </div>
            </div>
            <span className="text-sm text-muted-foreground line-clamp-1">{plan.title}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}