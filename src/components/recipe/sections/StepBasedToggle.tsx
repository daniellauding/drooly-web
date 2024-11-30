import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StepBasedToggleProps {
  isStepBased: boolean;
  onStepBasedChange: (enabled: boolean) => void;
}

export function StepBasedToggle({ isStepBased, onStepBasedChange }: StepBasedToggleProps) {
  return (
    <div className="flex items-center gap-2 py-4">
      <Switch
        checked={isStepBased}
        onCheckedChange={onStepBasedChange}
        id="step-based"
      />
      <Label htmlFor="step-based">Step-based Recipe</Label>
    </div>
  );
}