import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddToWeeklyPlanModal } from "@/components/recipe/AddToWeeklyPlanModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface WeeklyPlan {
  id: string;
  userId: string;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  day: string;
  mealType: string;
  title: string;
  status: 'planned' | 'completed' | 'cancelled';
}

export function WeeklyPlanContent() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { data: weeklyPlans = [], isLoading } = useQuery({
    queryKey: ['weeklyPlans', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const q = query(
        collection(db, "weeklyPlans"),
        where("userId", "==", user.uid)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WeeklyPlan[];
    },
    enabled: !!user?.uid
  });

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
    </div>
  );
}