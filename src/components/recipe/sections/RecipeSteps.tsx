import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { Recipe, RecipeStep } from "@/types/recipe";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RecipeStepsProps {
  steps: RecipeStep[];
  onChange: (steps: RecipeStep[]) => void;
  onAddStep: () => void;
}

export function RecipeSteps({ steps, onChange, onAddStep }: RecipeStepsProps) {
  const [openSteps, setOpenSteps] = useState<number[]>([0]); // First step open by default

  const toggleStep = (index: number) => {
    setOpenSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Accordion type="multiple" value={["recipe-steps"]} className="space-y-4">
      <AccordionItem value="recipe-steps" className="border rounded-lg">
        <AccordionTrigger className="px-4">
          <div className="flex items-center gap-2">
            <span>Recipe Steps</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Collapsible 
                key={index} 
                open={openSteps.includes(index)}
                onOpenChange={() => toggleStep(index)}
                className="border rounded-lg"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                  <span className="font-medium">
                    Step {index + 1}: {step.title || 'Untitled Step'}
                  </span>
                  {openSteps.includes(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <RecipeStepInput
                    step={step}
                    onChange={(updatedStep) => {
                      const newSteps = [...steps];
                      newSteps[index] = updatedStep;
                      onChange(newSteps);
                    }}
                    onDelete={() => {
                      if (steps.length > 1) {
                        const newSteps = steps.filter((_, i) => i !== index);
                        onChange(newSteps);
                      }
                    }}
                    ingredientGroups={["Main Ingredients", "Sauce", "Marinade", "Garnish"]}
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
            <Button
              variant="outline"
              onClick={onAddStep}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}