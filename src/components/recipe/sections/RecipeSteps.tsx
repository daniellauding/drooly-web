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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="recipe-steps">
        <AccordionTrigger className="text-lg font-semibold">
          Recipe Steps
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Collapsible 
                key={index} 
                open={openSteps.includes(index)}
                onOpenChange={() => toggleStep(index)}
                className="border rounded-lg p-2"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                  <span className="font-medium">
                    Step {index + 1}: {step.title || 'Untitled Step'}
                  </span>
                  {openSteps.includes(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
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