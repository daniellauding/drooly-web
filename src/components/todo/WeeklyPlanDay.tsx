import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Minus } from "lucide-react";

interface WeeklyPlanDayProps {
  day: string;
  meals: {
    type: string;
    plans: any[];
  }[];
  onShare: (plan: any) => void;
  onDelete: (planId: string) => void;
}

export function WeeklyPlanDay({ day, meals, onShare, onDelete }: WeeklyPlanDayProps) {
  return (
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShare(plan)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(plan.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}