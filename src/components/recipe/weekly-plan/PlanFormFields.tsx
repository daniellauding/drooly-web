import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/SingleSelect";
import { Label } from "@/components/ui/label";

interface PlanFormFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  selectedDay: string;
  onDayChange: (value: string) => void;
  mealType: string;
  onMealTypeChange: (value: string) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function PlanFormFields({
  title,
  onTitleChange,
  selectedDay,
  onDayChange,
  mealType,
  onMealTypeChange
}: PlanFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          placeholder="e.g., Family dinner"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div>
        <Label>Day</Label>
        <SingleSelect
          options={DAYS}
          selected={selectedDay}
          onChange={onDayChange}
          placeholder="Select day"
        />
      </div>

      <div>
        <Label>Meal Type</Label>
        <SingleSelect
          options={MEAL_TYPES}
          selected={mealType}
          onChange={onMealTypeChange}
          placeholder="Select meal type"
        />
      </div>
    </div>
  );
}