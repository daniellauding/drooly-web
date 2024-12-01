import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Users } from "lucide-react";
import { AddToWeeklyPlanModal } from "@/components/recipe/AddToWeeklyPlanModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SharePlanDialog } from "./SharePlanDialog";
import { useToast } from "@/components/ui/use-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

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

  const sharePlanMutation = useMutation({
    mutationFn: async ({ planId, email }: { planId: string; email: string }) => {
      const planRef = doc(db, "weeklyPlans", planId);
      await updateDoc(planRef, {
        [`collaborators.${email}`]: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlans'] });
      toast({
        title: "Plan shared successfully",
        description: "The user can now view and edit this plan"
      });
    },
    onError: (error) => {
      console.error("Error sharing plan:", error);
      toast({
        title: "Error sharing plan",
        description: "Failed to share the plan. Please try again.",
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
          <Card key={day} className="p-4">
            <h3 className="font-medium mb-4">{day}</h3>
            <div className="space-y-4">
              {meals.map(({ type, plans }) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{type}</Badge>
                    {plans.length === 0 && (
                      <span className="text-sm text-muted-foreground">No meals planned</span>
                    )}
                  </div>
                  {plans.map((plan) => (
                    <Card key={plan.id} className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {plan.recipeImage && (
                            <img 
                              src={plan.recipeImage} 
                              alt={plan.recipeTitle}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{plan.title}</p>
                            <p className="text-sm text-muted-foreground">{plan.recipeTitle}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(plan)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <AddToWeeklyPlanModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        recipeId=""
        recipeTitle=""
        recipeImage=""
      />

      <SharePlanDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onShare={(email) => {
          if (selectedPlan) {
            sharePlanMutation.mutate({ planId: selectedPlan.id, email });
          }
        }}
      />
    </div>
  );
}