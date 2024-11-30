import { Accordion } from "@/components/ui/accordion";
import { Recipe } from "@/types/recipe";
import { RecipeBasicInfo } from "./RecipeBasicInfo";
import { RecipeDetails } from "./RecipeDetails";
import { IngredientInput } from "../IngredientInput";
import { AccordionSection } from "./sections/AccordionSection";
import { StepBasedToggle } from "./sections/StepBasedToggle";
import { RecipeSteps } from "./sections/RecipeSteps";

interface RecipeAccordionsProps {
  recipe: Recipe;
  openSections: string[];
  validationErrors: Record<string, string[]>;
  isStepBased: boolean;
  onOpenSectionsChange: (sections: string[]) => void;
  onRecipeChange: (updates: Partial<Recipe>) => void;
  onAddStep: () => void;
  onStepBasedChange: (enabled: boolean) => void;
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
    <div className="space-y-4">
      {recipe.images.length > 0 && (
        <img
          src={recipe.images[0]}
          alt="Recipe"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={onOpenSectionsChange}
        className="space-y-4"
      >
        <AccordionSection
          value="basic-info"
          title="Basic Information"
          errors={validationErrors["basic-info"]}
        >
          <RecipeBasicInfo
            recipe={recipe}
            onChange={onRecipeChange}
          />
        </AccordionSection>

        <AccordionSection
          value="ingredients"
          title="Ingredients"
          errors={validationErrors["ingredients"]}
        >
          <IngredientInput
            ingredients={recipe.ingredients}
            onChange={(ingredients) => onRecipeChange({ ingredients })}
          />
        </AccordionSection>

        <AccordionSection
          value="details"
          title="Recipe Details"
          errors={validationErrors["details"]}
        >
          <RecipeDetails
            recipe={recipe}
            onChange={onRecipeChange}
          />
        </AccordionSection>
      </Accordion>

      <StepBasedToggle
        isStepBased={isStepBased}
        onStepBasedChange={onStepBasedChange}
      />

      {isStepBased && (
        <RecipeSteps
          steps={recipe.steps || []}
          onChange={(steps) => onRecipeChange({ steps })}
          onAddStep={onAddStep}
        />
      )}
    </div>
  );
}