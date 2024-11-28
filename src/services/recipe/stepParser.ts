import { RecipeStep } from "@/types/recipe";

export const parseSteps = (stepsText: string): RecipeStep[] => {
  const steps = stepsText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(step => {
      const durationMatch = step.match(/\[(\d+)\s*min\]/);
      const duration = durationMatch ? durationMatch[1] + " min" : "";
      
      // Remove step number and duration
      const instructions = step
        .replace(/^\d+\.\s*/, '')
        .replace(/\[\d+\s*min\]/, '')
        .trim();

      // Extract step number
      const stepNumber = step.match(/^(\d+)\./)?.[1] || "";
      
      return {
        title: `Step ${stepNumber}`,
        instructions,
        duration,
        media: [],
        ingredients: [] // Will be populated later based on ingredient mentions
      };
    });

  return steps;
};

export const mapIngredientsToSteps = (steps: RecipeStep[], ingredients: Array<{ name: string }>) => {
  return steps.map(step => {
    const stepIngredients = ingredients.filter(ing => 
      step.instructions.toLowerCase().includes(ing.name.toLowerCase())
    );
    
    return {
      ...step,
      ingredients: stepIngredients
    };
  });
};