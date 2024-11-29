import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { RecipeBasicInfo } from "./RecipeBasicInfo";
import { RecipeDetails } from "./RecipeDetails";
import { IngredientInput } from "../IngredientInput";
import { RecipeStepInput } from "../RecipeStepInput";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RecipeAccordionsProps {
  recipe: Recipe;
  openSections: string[];
  validationErrors: Record<string, string[]>;
  isStepBased: boolean;
  onOpenSectionsChange: (sections: string[]) => void;
  onRecipeChange: (updates: Partial<Recipe>) => void;
  onAddStep: () => void;
  onStepBasedChange: (value: boolean) => void;
}

export function RecipeAccordions({
  recipe,
  openSections,
  validationErrors,
  isStepBased,
  onOpenSectionsChange,
  onRecipeChange,
  onAddStep,
  onStepBasedChange
}: RecipeAccordionsProps) {
  return (
    <Accordion
      type="multiple"
      value={openSections}
      onValueChange={onOpenSectionsChange}
      className="space-y-4"
    >
      <AccordionItem value="basic-info" className="border rounded-lg">
        <AccordionTrigger className="px-4">
          <div className="flex items-center gap-2">
            <span>Basic Information</span>
            {validationErrors["basic-info"]?.length > 0 && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          {validationErrors["basic-info"]?.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationErrors["basic-info"].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <RecipeBasicInfo
            recipe={recipe}
            onChange={onRecipeChange}
          />
        </AccordionContent>
      </AccordionItem>

      {!isStepBased && (
        <AccordionItem value="ingredients" className="border rounded-lg">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <span>Ingredients</span>
              {validationErrors["ingredients"]?.length > 0 && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {validationErrors["ingredients"]?.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors["ingredients"].map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <IngredientInput
              ingredients={recipe.ingredients}
              onChange={(ingredients) => onRecipeChange({ ingredients })}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="details" className="border rounded-lg">
        <AccordionTrigger className="px-4">
          <div className="flex items-center gap-2">
            <span>Recipe Details</span>
            {validationErrors["details"]?.length > 0 && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          {validationErrors["details"]?.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationErrors["details"].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <RecipeDetails
            recipe={recipe}
            onChange={onRecipeChange}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="steps" className="border rounded-lg">
        <AccordionTrigger className="px-4">
          <div className="flex items-center justify-between w-full pr-4">
            <span>Recipe Steps</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={isStepBased}
                onCheckedChange={onStepBasedChange}
                id="step-based"
              />
              <Label htmlFor="step-based">Step-based Recipe</Label>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <RecipeStepInput
                key={index}
                step={step}
                onChange={(updatedStep) => {
                  const newSteps = [...recipe.steps];
                  newSteps[index] = updatedStep;
                  onRecipeChange({ steps: newSteps });
                }}
                onDelete={() => {
                  if (recipe.steps.length > 1 || !isStepBased) {
                    const newSteps = recipe.steps.filter((_, i) => i !== index);
                    onRecipeChange({ steps: newSteps });
                  }
                }}
                ingredientGroups={isStepBased ? ["Main Ingredients", "Sauce", "Marinade", "Garnish"] : []}
              />
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