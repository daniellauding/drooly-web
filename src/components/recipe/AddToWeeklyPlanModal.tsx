import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/SingleSelect";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface AddToWeeklyPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
}

export function AddToWeeklyPlanModal({
  open,
  onOpenChange,
  recipeId,
  recipeTitle,
  recipeImage
}: AddToWeeklyPlanModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const weeklyPlanDoc = await addDoc(collection(db, "weeklyPlans"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous Chef",
        userAvatar: user.photoURL || "/placeholder.svg",
        recipeId,
        recipeTitle,
        recipeImage,
        title,
        day: selectedDay,
        mealType,
        createdAt: serverTimestamp(),
        status: "planned" // planned, completed, cancelled
      });

      toast({
        title: "Success!",
        description: "Added to your weekly cooking plan"
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error adding to weekly plan:", error);
      toast({
        title: "Error",
        description: "Failed to add to weekly plan",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Weekly Cooking Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="e.g., Family dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Day</Label>
            <SingleSelect
              options={DAYS}
              selected={selectedDay}
              onChange={setSelectedDay}
              placeholder="Select day"
            />
          </div>
          <div>
            <Label>Meal Type</Label>
            <SingleSelect
              options={MEAL_TYPES}
              selected={mealType}
              onChange={setMealType}
              placeholder="Select meal type"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add to Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}