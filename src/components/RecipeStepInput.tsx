import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { RecipeStep } from "@/pages/CreateRecipe";

interface RecipeStepInputProps {
  step: RecipeStep;
  onChange: (step: RecipeStep) => void;
  onDelete: () => void;
}

export function RecipeStepInput({ step, onChange, onDelete }: RecipeStepInputProps) {
  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Step title"
          value={step.title}
          onChange={(e) => onChange({ ...step, title: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Duration (e.g., 10 min)"
          value={step.duration}
          onChange={(e) => onChange({ ...step, duration: e.target.value })}
          className="w-32"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        placeholder="Step instructions"
        value={step.instructions}
        onChange={(e) => onChange({ ...step, instructions: e.target.value })}
      />
    </div>
  );
}