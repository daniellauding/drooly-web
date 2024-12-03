import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Users, Minus } from "lucide-react";
import { AddToWeeklyPlanModal } from "@/components/recipe/AddToWeeklyPlanModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SharePlanDialog } from "./SharePlanDialog";
import { useToast } from "@/components/ui/use-toast";
import { WeeklyPlanDay } from "./WeeklyPlanDay";

interface WeeklyPlan {
  id: string;
  userId: string;
  recipeId: string | null;
  recipeTitle: string;
  recipeImage: string | null;
  day: string;
  mealType: string;
  title: string;
  status: 'planned' | 'completed' | 'cancelled';
  collaborators?: Record<string, boolean>;
  owner?: string;
}

export function WeeklyPlanContent() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WeeklyPlan | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: weeklyPlans = [], isLoading } = useQuery({
    queryKey: ['weeklyPlans', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const plansQuery = query(
        collection(db, "weeklyPlans"),
        where("userId", "==", user.uid)
      );
      
      const collaborativePlansQuery = query(
        collection(db, "weeklyPlans"),
        where(`collaborators.${user.uid}`, "==", true)
      );
      
      const [ownPlansSnapshot, collaborativePlansSnapshot] = await Promise.all([
        getDocs(plansQuery),
        getDocs(collaborativePlansQuery)
      ]);
      
      const ownPlans = ownPlansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const collaborativePlans = collaborativePlansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return [...ownPlans, ...collaborativePlans] as WeeklyPlan[];
    },
    enabled: !!user?.uid
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user?.uid) throw new Error("User not authenticated");
      console.log('Deleting plan:', planId);
      const planRef = doc(db, "weeklyPlans", planId);
      const planDoc = await getDoc(planRef);
      
      if (!planDoc.exists()) {
        throw new Error("Plan not found");
      }

      const planData = planDoc.data();
      if (planData.userId !== user.uid && !planData.collaborators?.[user.uid]) {
        throw new Error("Not authorized to delete this plan");
      }

      await deleteDoc(planRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlans'] });
      toast({
        title: "Plan removed",
        description: "The meal plan has been removed from your schedule"
      });
    },
    onError: (error) => {
      console.error("Error removing plan:", error);
      toast({
        title: "Error removing plan",
        description: "Failed to remove the plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleShare = (plan: WeeklyPlan) => {
    setSelectedPlan(plan);
    setShowShareDialog(true);
  };

  const groupedPlans = DAYS.map(day => ({
    day,
    meals: MEAL_TYPES.map(type => ({
      type,
      plans: weeklyPlans.filter(plan => plan.day === day && plan.mealType === type)
    }))
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Weekly Meal Plan</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Plan
        </Button>
      </div>

      <div className="grid gap-6">
        {groupedPlans.map(({ day, meals }) => (
          <WeeklyPlanDay
            key={day}
            day={day}
            meals={meals}
            onShare={handleShare}
            onDelete={(planId) => deletePlanMutation.mutate(planId)}
          />
        ))}
      </div>

      <AddToWeeklyPlanModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      <SharePlanDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onShare={(email) => {
          if (selectedPlan) {
            // Handle share mutation here
            setShowShareDialog(false);
          }
        }}
      />
    </div>
  );
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
