import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Trash2, Video } from "lucide-react";
import { RecipeStep } from "@/types/recipe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { useState } from "react";

interface RecipeStepInputProps {
  step: RecipeStep;
  onChange: (step: RecipeStep) => void;
  onDelete: () => void;
  ingredientGroups?: string[];
}

export function RecipeStepInput({ step, onChange, onDelete, ingredientGroups = [] }: RecipeStepInputProps) {
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
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

      {ingredientGroups.length > 0 && (
        <Select
          value={step.ingredientGroup}
          onValueChange={(value) => onChange({ ...step, ingredientGroup: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ingredient group for this step" />
          </SelectTrigger>
          <SelectContent>
            {ingredientGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Textarea
        placeholder="Step instructions"
        value={step.instructions}
        onChange={(e) => onChange({ ...step, instructions: e.target.value })}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          className="gap-2"
        >
          <Image className="h-4 w-4" />
          Add Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          className="gap-2"
        >
          <Video className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {showMediaUpload && (
        <ImageUpload
          images={step.media || []}
          featuredImageIndex={0}
          onChange={(media) => onChange({ ...step, media })}
        />
      )}
    </div>
  );
}